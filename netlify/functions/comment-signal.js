const SUPA_URL = 'https://kfpdzqwtninhdkwtjruc.supabase.co';
const SUPA_KEY = 'sb_publishable_a-kAHWFg9Kv3GFVGvxIjTg_c6QlqZbB';

exports.handler = async function () {
  try {
    const r = await fetch(`${SUPA_URL}/rest/v1/rpc/latest_visitor_comment_signal`, {
      method: 'POST',
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        'Content-Type': 'application/json'
      },
      body: '{}'
    });
    if (!r.ok) throw new Error('Supabase request failed');
    const rows = await r.json();
    const latest = rows && rows[0] ? rows[0] : null;
    return {
      statusCode: 200,
      headers: {'Content-Type':'application/json','Cache-Control':'no-store'},
      body: JSON.stringify({ok:true, latest})
    };
  } catch (e) {
    return {statusCode:500, headers:{'Content-Type':'application/json'}, body:JSON.stringify({ok:false})};
  }
};
