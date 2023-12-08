import BannerImage from "~/components/BannerImage";
import home from "../assets/home.jpg";

export default function JoinUs() {
  return (
    <div>
      <BannerImage title="Join Us" src={home} style={{ height: "200px " }} />
      <div className="py-8 px-4 mx-auto max-w-screen-lg">
        <h2 className="text-3xl font-bold mb-4">Join Us</h2>
        <p className="mb-4">
          Join our team of passionate individuals who are dedicated to
          innovation and excellence. We offer a dynamic work environment where
          your ideas are valued and your talents are nurtured.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Why Join Us?</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Opportunity to work on cutting-edge projects.</li>
          <li>A collaborative and inclusive work culture.</li>
          <li>Continuous learning and growth opportunities.</li>
          <li>Attractive compensation and benefits.</li>
        </ul>
        <p className="mb-4">
          We are constantly looking for talented individuals who are passionate
          about technology and innovation. If you believe you can contribute to
          our team, we'd love to hear from you!
        </p>
      </div>
    </div>
  );
}
