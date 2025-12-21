import Header from './components/Header';
import Hero from './components/Hero';
import FeatureSections from './components/FeatureSections';
import SpecializedTalents from './components/SpecializedTalents';
import Footer from './components/Footer';

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* <Header /> */}
      <section id="home">
        <Hero />
      </section>
      <section id="our-solution">
        <FeatureSections />
      </section>
      <section id="use-cases">
        <SpecializedTalents />
      </section>
      <section id="about">
        <Footer />
      </section>
    </main>
  );
}