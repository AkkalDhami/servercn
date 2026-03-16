import Video from "next-video";

export default function DemoVideo() {
  return <Video src={"/demo.mp4"} autoPlay loop />;
}
