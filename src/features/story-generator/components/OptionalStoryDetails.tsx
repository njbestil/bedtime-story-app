import { FaAngleDown } from 'react-icons/fa6'
import Input from '../../../components/Input'
import RadioButton from '../../../components/RadioButton'
import type { StoryFormChangeHandler, StoryFormValues } from '../storyGenerator.types'

type OptionalStoryDetailsProps = {
  isOpen: boolean
  lengths: readonly string[]
  values: Pick<StoryFormValues, 'childName' | 'ageRange' | 'length' | 'lesson'>
  onToggle: () => void
  onFieldChange: StoryFormChangeHandler
}

function OptionalStoryDetails({
  isOpen,
  lengths,
  values,
  onToggle,
  onFieldChange,
}: OptionalStoryDetailsProps) {
  return (
    <div className="border-outline-muted border-t pt-3">
      <button
        type="button"
        className="type-card-title text-content-primary flex min-h-11 w-full items-center justify-between text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        aria-expanded={isOpen}
        aria-controls="optional-story-details"
        onClick={onToggle}
      >
        Optional details
        <FaAngleDown
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div id="optional-story-details" className="space-y-5 pt-4">
          <div>
            <label htmlFor="child-name" className="type-caption text-content-primary mb-2 block">
              Child&apos;s name
            </label>
            <Input
              id="child-name"
              name="childName"
              value={values.childName}
              onChange={onFieldChange('childName')}
              placeholder="e.g. Luna"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="age-range" className="type-caption text-content-primary mb-2 block">
              Age range
            </label>
            <Input
              id="age-range"
              name="ageRange"
              value={values.ageRange}
              onChange={onFieldChange('ageRange')}
              placeholder="e.g. 5–7 years"
              inputMode="numeric"
            />
          </div>

          <fieldset>
            <legend className="type-caption text-content-primary mb-2">Story length</legend>
            <div className="flex flex-wrap gap-2">
              {lengths.map((length) => (
                <RadioButton
                  key={length}
                  name="length"
                  value={length}
                  checked={values.length === length}
                  onChange={onFieldChange('length')}
                >
                  {length}
                </RadioButton>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="story-lesson" className="type-caption text-content-primary mb-2 block">
              Story lesson or moral <span className="text-content-muted">(optional)</span>
            </label>
            <Input
              id="story-lesson"
              name="lesson"
              value={values.lesson}
              onChange={onFieldChange('lesson')}
              placeholder="e.g. Kindness makes every journey better"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default OptionalStoryDetails
