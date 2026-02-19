const { getOneWrapDomain } = require("../database/wraps");

export default async function handler(req, res) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host =
    req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const currentUrl = new URL(req.url, `${proto}://${host}`);

  const parts = currentUrl.pathname.split("/").filter(Boolean);
  const prefix = parts[0];

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

  const targetUrl = new URL(targetBase);
  targetUrl.pathname = remainingPath ? `/${remainingPath}` : "/";
  targetUrl.search = currentUrl.search;

  return res.redirect(302, targetUrl.toString());
}
