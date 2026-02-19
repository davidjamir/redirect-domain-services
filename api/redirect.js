const { getOneWrapDomain } = require("../database/wraps");

export default async function handler(req, res) {
  const wrap_host = req.headers.host;
  const slug = req.query.slug || "";

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

  let targetHost = record.target_host;
  if (!targetHost.startsWith("http")) {
    targetHost = `https://${targetHost}`;
  }

  const url = new URL(targetHost);

  if (remainingPath) {
    url.pathname = `/${remainingPath}`;
  }

  // copy toàn bộ query trừ slug
  Object.keys(req.query).forEach((key) => {
    if (key !== "slug") {
      url.searchParams.set(key, req.query[key]);
    }
  });

  return res.redirect(302, url.toString());
}
