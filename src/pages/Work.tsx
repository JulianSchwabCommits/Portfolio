import PageTransition from "../components/PageTransition";
import Hero from "../components/Hero";
import Experience from "../components/Experience";

const Work = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24 pt-0 pb-20">
        <div className="pt-0">
          <Hero />
        </div>
        <div className="mt-16">
          <Experience />
        </div>
      </div>
    </PageTransition>
  );
};

export default Work;
  