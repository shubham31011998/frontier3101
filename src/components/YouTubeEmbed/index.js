const YouTubeEmbed = () => (
  <section className="my-12 text-center">

    <div className="flex justify-center video-container">
      <iframe width="560"
        height="315"
        src="https://www.youtube.com/embed/pg_8rHbVQaw?autoplay=1&mute=1&controls=0&rel=0"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer;autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen></iframe>
    </div>
  </section>
);

export default YouTubeEmbed;
