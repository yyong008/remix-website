import BannerImage from "~/components/BannerImage";
import home from "../assets/home.jpg";

export default function AboutUs() {
  return (
    <div>
      <BannerImage title="About Us" src={home} style={{ height: "200px " }} />
      <div className="py-8 px-4 mx-auto max-w-screen-lg">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="mb-4">
          We are an innovative company committed to providing exceptional
          solutions for our clients. Through the fusion of technology and
          creativity, we continually strive for excellence, creating value for
          our clients. Our mission is to deliver top-notch services and products
          in an ever-evolving market.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Our Values</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>
            <strong>Innovation</strong>: Constantly exploring new methods and
            technologies to meet client needs.
          </li>
          <li>
            <strong>Quality</strong>: Pursuing excellence, continuously
            improving service and product quality.
          </li>
          <li>
            <strong>Customer-Centric</strong>: Placing customer needs at the
            core of our work, aiming to exceed expectations.
          </li>
        </ul>
        <p className="mb-4">
          Our team comprises tech experts and creative minds with extensive
          industry experience and specialized knowledge. We endeavor to remain
          at the forefront of technology and creativity, offering the best
          solutions for our clients.
        </p>
        <p className="mb-4">
          Whether you’re a small business or a large enterprise, we provide
          tailored solutions to meet your needs. Understanding the uniqueness of
          each client, we strive to deliver customized solutions that best fit
          your requirements.
        </p>
        <p>
          If you're seeking a reliable partner to realize your vision, get in
          touch with us. Let’s collaborate and build a brighter future together!
        </p>
      </div>
    </div>
  );
}
