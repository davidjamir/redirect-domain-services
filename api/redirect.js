const { getOneWrapDomain } = require("../database/wraps");

export default async function handler(req, res) {
  const wrap_host = req.headers.host;
  const slug = req.query.slug || "";
  console.log("Slug: ", slug)

  const parts = slug.split("/").filter(Boolean);
  const prefix = parts[0];
  const remainingPath = parts.slice(1).join("/");

  // lookup DB theo site + code
  const record = await getOneWrapDomain({
    wrap_host,
    prefix,
  });

  if (!record) {
    return res.status(404).end();
  }

  const targetHost = record.target_host;
  const targetUrl = `https://${targetHost}/${remainingPath}`;

  return res.redirect(302, targetUrl);
}
