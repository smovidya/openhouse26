<script lang="ts">
  import QrScanner from "qr-scanner";
  let videoElement: HTMLVideoElement;

  function onDecode(result) {
    console.log(result);
  }

  let qrScanner: QrScanner | null = null;

  $effect(() => {
    qrScanner = new QrScanner(videoElement, (result) => onDecode(result));
  });
</script>

<div>
  <video bind:this={videoElement}>
    <track kind="captions" />
  </video>
</div>
