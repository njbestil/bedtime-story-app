import { type SubmitEvent, useState } from 'react'
import { useNavigate } from "react-router"
import { FaRegCompass, FaBookSkull} from 'react-icons/fa6'
import Button from '../../components/Button'
import OptionalStoryDetails from './components/OptionalStoryDetails'
import StoryBasicsFields from './components/StoryBasicsFields'
import AppHeader from '../../components/layouts/AppHeader'
import { APP_PATHS } from "../../routes/paths"
import {
  INITIAL_FORM_VALUES,
  STORY_CATEGORIES,
  STORY_LENGTHS,
} from './storyGenerator.constants'
import type { StoryFormChangeHandler, StoryFormValues } from './storyGenerator.types'

function StoryGeneratorScreen() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<StoryFormValues>(INITIAL_FORM_VALUES)
  const [isOptionalDetailsOpen, setIsOptionalDetailsOpen] = useState(false)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

  const updateField: StoryFormChangeHandler = (field) => {
    return (event) => {
      setFormValues((currentValues) => ({
        ...currentValues,
        [field]: event.target.value,
      }))
    }
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleDescriptionInvalid = () => {
    setHasAttemptedSubmit(true)
  }

  function handleLibraryClick() {
    navigate(APP_PATHS.library)
  }

  const headerStart = (
    <button
      type="button"
      className="text-content-primary flex items-center gap-1 text-sm"
      aria-label="Library"
      onClick={handleLibraryClick}
    >
      <FaBookSkull aria-hidden="true" />
      <span>Library</span>
    </button>
  )

  const headerCenter = (
    <h1 className="type-brand text-brand-accent ">
      Find a Story
    </h1>
  )

  return (
    <>
      <AppHeader start={headerStart}  center={headerCenter} />
      <section className="pt-6 pb-28" aria-labelledby="generator-title">
        <h1 id="generator-title" className="sr-only">
          Find a Story
        </h1>

        <form id="story-generator-form" className="space-y-7" onSubmit={handleSubmit}>
          <StoryBasicsFields
            categories={STORY_CATEGORIES}
            selectedCategory={formValues.category}
            description={formValues.description}
            descriptionError={
              hasAttemptedSubmit && !formValues.description.trim()
                ? "Please describe the kind of story you'd like."
                : undefined
            }
            onCategoryChange={updateField('category')}
            onDescriptionChange={updateField('description')}
            onDescriptionInvalid={handleDescriptionInvalid}
          />

          <OptionalStoryDetails
            isOpen={isOptionalDetailsOpen}
            lengths={STORY_LENGTHS}
            values={formValues}
            onToggle={() => setIsOptionalDetailsOpen((isOpen) => !isOpen)}
            onFieldChange={updateField}
          />
        </form>

        <div className="bg-app-background/95 border-outline-muted fixed inset-x-0 bottom-0 z-30 border-t px-2.5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm">
          <Button form="story-generator-form" type="submit" leadingIcon={<FaRegCompass />}>
            Set Sail!
          </Button>
        </div>
      </section>
    </>
  )
}

export default StoryGeneratorScreen
