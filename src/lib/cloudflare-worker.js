export default {
  async fetch(request) {
    return await handleRequest(request).catch((err) => new Response(err.stack, { status: 500 }));
  },
};

const id = "0123456780123456";
const headers = {
  "Access-Control-Allow-Origin": "https://cyan-2048.github.io",
  "Cache-Control": "public, max-age=3600",
};

async function handleRequest(request) {
  const { search } = new URL(request.url);
  const params = Object.fromEntries(new URLSearchParams(search));

  if (params.type == "check") {
    const { env, version, curef } = params;
    const resp = await fetch(
      `http://mst.${env}.kaiostech.com/check.php?id=${id}&cltp=1&fv=${version || "0"}&mode=2&type=FIRMWARE&curef=${
        curef || "0"
      }`
    );

    const text = await resp.text();

    return new Response(text, { headers });
  }

  if (params.type == "download") {
    const { env, version, curef, fwid, tv } = params;
    const resp = await fetch(`http://mst.${env}.kaiostech.com/download_request.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${id}&cltp=1&fv=${version}&tv=${tv}&mode=2&type=FIRMWARE&curef=${curef}&salt=1&vk=1&fw_id=${fwid}`,
    });
    return new Response(await resp.text(), { headers });
  }

  throw new Error("?");
}
