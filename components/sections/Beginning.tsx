import { wedding } from '@/content/wedding';
import { Media } from '../Media';
import { Reveal } from '../Reveal';

export function Beginning() {
  const [a, b] = wedding.beginning.portraits;
  return (
    <section
      data-section="beginning"
      aria-labelledby="beginning-line"
      className="relative py-24 pl-10 pr-6 md:px-10 md:py-40"
    >
      <Reveal duration={2.2} className="mx-auto max-w-6xl">
        <div className="grid grid-cols-12 gap-y-14 md:gap-y-0">
          <div className="col-span-9 col-start-1 md:col-span-5 md:col-start-3">
            <Media media={a} aspect="3 / 4" sizes="(min-width: 768px) 40vw, 75vw" className="w-full" />
          </div>
          <div className="col-span-9 col-start-4 md:col-span-5 md:col-start-6 md:row-start-2 md:mt-6 md:translate-x-10">
            <Media media={b} aspect="3 / 4" sizes="(min-width: 768px) 40vw, 75vw" className="w-full" />
          </div>
          <div className="col-span-12 md:row-start-3 md:mt-28">
            <p
              id="beginning-line"
              className="thread-mask mx-auto max-w-[34ch] px-3 py-2 text-center font-serif text-3xl font-light leading-snug text-ink dark:text-ivory md:max-w-[46ch] md:text-5xl md:leading-[1.25]"
            >
              {wedding.beginning.line}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
