<script>
  import curefList from "./curef.json";

  let version = "",
    curef = "",
    env = "fota",
    result = 0;

  const worker = "https://fota-kaios.cyan-2048.workers.dev/";

  async function fetchWorker(params = {}) {
    const resp = await fetch(worker + "?" + new URLSearchParams({ version, curef, env, ...params }).toString());
    const text = await resp.text();
    return text ? new DOMParser().parseFromString(text, "text/xml") : null;
  }

  let download_loading = false,
    download_link = null;

  async function check() {
    download_link = null;
    download_loading = false;

    result = 0;
    const xml = await fetchWorker({ type: "check" });

    if (!xml) {
      result = `empty`;
      return;
    }
    console.error(xml);
    const fwid = xml.querySelector("FW_ID")?.innerHTML;
    const tv = xml.querySelector("TV")?.innerHTML;

    result = {
      tv,
      fwid,
      content: xml.documentElement.outerHTML,
    };
  }

  async function download() {
    download_loading = true;
    const xml = await fetchWorker({ type: "download", tv: result.tv, fwid: result.fwid });
    download_loading = false;

    const url = xml.querySelector("DOWNLOAD_URL")?.innerHTML;
    const slave = xml.querySelector("SLAVE")?.innerHTML;

    download_link = "http://" + slave + url;
  }
</script>

<main class="container">
  <h1>fota.sh</h1>
  <label for="curef">CUREF</label>
  <input id="curef" bind:value={curef} type="text" placeholder="CUREF" />
  <label for="version">VERSION</label>
  <input id="version" bind:value={version} type="text" placeholder="VERSION" />
  <div class="grid">
    <button on:click={check}>CHECK</button>
  </div>
  <article aria-busy={result === 0 || null}>
    {#if result?.tv}
      {@const { fwid, tv, content } = result}
      <h4><ins>UPDATE AVAILABLE!</ins></h4>
      <details>
        <summary>TO_VERSION: {tv}</summary>
        <p>{tv}</p>
      </details>
      <details>
        <summary>FWID: {fwid}</summary>
        <p>{fwid}</p>
      </details>
      <details>
        <summary>CONTENT</summary>
        <p>{content}</p>
      </details>

      <button aria-busy={download_loading || null} on:click={download}>Generate Download URL</button>
      {#if download_link}
        <a href={download_link}>Click Here</a>
      {/if}
    {/if}
    {#if result == "empty"}
      fota server returned nothing. :(
    {/if}
  </article>
  <label for="cureflist">CUREF List</label>
  <select id="cureflist" bind:value={curef}>
    <option value="">None</option>
    {#each curefList as { description, curef } (curef)}
      <option value={curef}>
        {description}: {curef}
      </option>
    {/each}
  </select>
  <label for="envList">ENV</label>
  <select id="envList" bind:value={env}>
    <option value="fota">prod</option>
    <option value="test">test</option>
    <option value="fota.dev">dev</option>
  </select>
</main>
