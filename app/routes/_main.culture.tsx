import BannerImage from "~/components/BannerImage";
import home from "../assets/home.jpg";

export default function Culture() {
  return (
    <div>
      <BannerImage title="Culture" src={home} style={{ height: "200px " }} />
      <div className="company-culture py-8 px-4 mx-auto max-w-screen-lg">
        <h2 className="text-3xl font-bold mb-4">Our Company Culture</h2>
        <p className="mb-4">
          At our company, we foster a culture of collaboration, innovation, and
          inclusivity. We believe in creating an environment where every
          individual's voice is heard and valued.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Core Principles</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Collaboration: Working together to achieve common goals.</li>
          <li>Innovation: Encouraging new ideas and creative thinking.</li>
          <li>Inclusivity: Respecting diverse perspectives and backgrounds.</li>
          <li>
            Integrity: Upholding honesty and ethical behavior in everything we
            do.
          </li>
        </ul>
        <p className="mb-4">
          We celebrate diversity and recognize that it is one of our greatest
          strengths. Our inclusive culture empowers employees to bring their
          authentic selves to work and contribute meaningfully to our success.
        </p>
        <p>
          We are committed to providing a supportive and nurturing environment
          where employees can thrive both personally and professionally.
        </p>
      </div>
    </div>
  );
}
