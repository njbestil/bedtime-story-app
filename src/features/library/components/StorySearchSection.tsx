import { FaMagnifyingGlass } from "react-icons/fa6";
import Button from "../../../components/Button";
import { APP_PATHS } from '../../../routes/paths'

type StorySearchSectionProps = {
  imgSrc?: string
  navigate: (path: string) => void;
};

function StorySearchSection({ imgSrc, navigate }: StorySearchSectionProps) {
  return (
    <section className="pt-6 pb-5 text-center" aria-labelledby="discovery-title">
      <img
        src={imgSrc}
        alt="Pirate searching for story books"
        className="w-full bg-cover"
      />

      <h1
        id="discovery-title"
        className="type-pirate-heading text-brand-accent mt-6"
      >
        What story shall we discover?
      </h1>

      <p className="type-body text-content-primary mx-auto mt-3 max-w-[310px]">
        Chart a course for treasure!
      </p>

      <Button
        className="
                type-action 
                mt-3 min-h-14 
                w-full 
                items-center 
                justify-center 
                gap-3"
        onClick={() => navigate(APP_PATHS.storyGenerator)}
      >
        <FaMagnifyingGlass />
        Search a story
      </Button>
    </section>
  )
}

export default StorySearchSection