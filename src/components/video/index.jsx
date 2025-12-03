const Video = ({ video }) => {
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video className="w-full" controls>
      <source src={video.src} />
    </video>
  );
};

export default Video;
