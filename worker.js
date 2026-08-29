/* A Farm API — Cloudflare Worker + D1.
   Replaces the old Node/SQLite server. No secrets live in this file —
   GOOGLE_CLIENT_ID/ALLOWED_ORIGIN come from wrangler.toml [vars] (not
   secret), and ADMIN_TOKEN is set with `wrangler secret put ADMIN_TOKEN`
   and read only from env at request time. */

const STATUS_PIPELINE = ["Order Received", "Preparing", "Ready", "Completed"];

function corsHeaders(env){
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin"
  };
}
function json(env, status, data){
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(env) }
  });
}
function isAdmin(request, env){
  const auth = request.headers.get("Authorization") || "";
  return !!env.ADMIN_TOKEN && auth === "Bearer " + env.ADMIN_TOKEN;
}
async function getOrCreateCustomer(env, key){
  let row = await env.DB.prepare("SELECT * FROM customers WHERE key = ?").bind(key).first();
  if(!row){
    await env.DB.prepare(
      "INSERT INTO customers (key, name, phone, email, google_sub, points, created_at) VALUES (?, '', '', '', '', 0, ?)"
    ).bind(key, new Date().toISOString()).run();
    row = await env.DB.prepare("SELECT * FROM customers WHERE key = ?").bind(key).first();
  }
  return row;
}

export default {
  async fetch(request, env){
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if(method === "OPTIONS"){
      return new Response(null, { headers: corsHeaders(env) });
    }

    try{
      // GET /api/products
      if(method === "GET" && path === "/api/products"){
        const { results } = await env.DB.prepare("SELECT * FROM products ORDER BY category, name").all();
        return json(env, 200, results);
      }

      // /api/customers/:key
      let m = path.match(/^\/api\/customers\/([^/]+)$/);
      if(m){
        const key = decodeURIComponent(m[1]);
        if(method === "GET"){
          return json(env, 200, await getOrCreateCustomer(env, key));
        }
        if(method === "POST"){
          const body = await request.json().catch(() => ({}));
          const name = typeof body.name === "string" ? body.name.slice(0, 120) : "";
          const phone = typeof body.phone === "string" ? body.phone.slice(0, 40) : "";
          await getOrCreateCustomer(env, key);
          await env.DB.prepare("UPDATE customers SET name = ?, phone = ? WHERE key = ?").bind(name, phone, key).run();
          return json(env, 200, await env.DB.prepare("SELECT * FROM customers WHERE key = ?").bind(key).first());
        }
      }

      // GET /api/customers/:key/orders
      m = path.match(/^\/api\/customers\/([^/]+)\/orders$/);
      if(m && method === "GET"){
        const key = decodeURIComponent(m[1]);
        const { results } = await env.DB.prepare(
          "SELECT * FROM orders WHERE customer_key = ? ORDER BY id DESC LIMIT 50"
        ).bind(key).all();
        return json(env, 200, results);
      }

      // POST /api/orders  { customerKey, itemsSummary, total }
      if(method === "POST" && path === "/api/orders"){
        const body = await request.json().catch(() => ({}));
        const customerKey = typeof body.customerKey === "string" && body.customerKey ? body.customerKey : null;
        const itemsSummary = typeof body.itemsSummary === "string" ? body.itemsSummary.slice(0, 2000) : "";
        const total = Number(body.total);
        if(!customerKey || !itemsSummary || !isFinite(total) || total <= 0){
          return json(env, 400, { error: "customerKey, itemsSummary, and a positive total are required" });
        }
        await getOrCreateCustomer(env, customerKey);
        const pointsEarned = Math.floor(total);
        const createdAt = new Date().toISOString();
        const insert = await env.DB.prepare(
          "INSERT INTO orders (customer_key, items_summary, total, points_earned, status, created_at) VALUES (?, ?, ?, ?, 'Order Received', ?)"
        ).bind(customerKey, itemsSummary, total, pointsEarned, createdAt).run();
        await env.DB.prepare("UPDATE customers SET points = points + ? WHERE key = ?").bind(pointsEarned, customerKey).run();
        const customer = await env.DB.prepare("SELECT * FROM customers WHERE key = ?").bind(customerKey).first();
        const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(insert.meta.last_row_id).first();
        return json(env, 200, { order, customer });
      }

      // GET /api/orders — admin only
      if(method === "GET" && path === "/api/orders"){
        if(!isAdmin(request, env)) return json(env, 401, { error: "Admin token required" });
        const { results } = await env.DB.prepare(`
          SELECT orders.*, customers.name AS customer_name, customers.phone AS customer_phone
          FROM orders LEFT JOIN customers ON customers.key = orders.customer_key
          ORDER BY orders.id DESC LIMIT 200
        `).all();
        return json(env, 200, results);
      }

      // PATCH /api/orders/:id — admin only, { status }
      m = path.match(/^\/api\/orders\/(\d+)$/);
      if(m && method === "PATCH"){
        if(!isAdmin(request, env)) return json(env, 401, { error: "Admin token required" });
        const id = Number(m[1]);
        const body = await request.json().catch(() => ({}));
        if(!STATUS_PIPELINE.includes(body.status)){
          return json(env, 400, { error: "status must be one of: " + STATUS_PIPELINE.join(", ") });
        }
        await env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(body.status, id).run();
        const row = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
        if(!row) return json(env, 404, { error: "Order not found" });
        return json(env, 200, row);
      }

      // POST /api/auth/google — { idToken } -> verifies with Google, upserts customer
      if(method === "POST" && path === "/api/auth/google"){
        const body = await request.json().catch(() => ({}));
        if(!body.idToken) return json(env, 400, { error: "idToken required" });
        const verifyRes = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(body.idToken));
        if(!verifyRes.ok) return json(env, 401, { error: "Invalid Google token" });
        const payload = await verifyRes.json();
        if(payload.aud !== env.GOOGLE_CLIENT_ID){
          return json(env, 401, { error: "Token audience mismatch" });
        }
        const key = "google:" + payload.sub;
        await getOrCreateCustomer(env, key);
        await env.DB.prepare("UPDATE customers SET email = ?, google_sub = ?, name = CASE WHEN name = '' THEN ? ELSE name END WHERE key = ?")
          .bind(payload.email || "", payload.sub, payload.name || "", key).run();
        const customer = await env.DB.prepare("SELECT * FROM customers WHERE key = ?").bind(key).first();
        return json(env, 200, { key, customer });
      }

      return json(env, 404, { error: "Unknown API route" });
    }catch(e){
      return json(env, 500, { error: e.message || "Server error" });
    }
  }
};
