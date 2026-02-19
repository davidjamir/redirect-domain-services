const { getOneWrapDomain } = require("../database/wraps");

export default async function handler(req, res) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const currentUrl = new URL(req.url, `${proto}://${host}`);

  const segments = currentUrl.pathname.split("/").filter(Boolean);
  if (!segments.length) {
    return res.status(404).end();
  }

  const prefix = segments[0];

  const slug = req.query.slug || "";
  const parts = slug.split("/").filter(Boolean);

  const remainingPath = parts.slice(1).join("/");

  // lookup DB theo site + code
  const record = await getOneWrapDomain({
    wrap_host: host,
    prefix,
  });

  if (!record) {
    return res.status(404).end();
  }

  // tạo URL target
  const targetBase = record.target_host.startsWith("http")
    ? record.target_host
    : `https://${record.target_host}`;

  const targetUrl = `${targetBase}/${remainingPath}`;

  return res.redirect(302, targetUrl);
}
