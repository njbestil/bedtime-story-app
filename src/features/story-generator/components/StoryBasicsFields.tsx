import type { ChangeEvent, InvalidEvent } from 'react'
import RadioButton from '../../../components/RadioButton'
import Textarea from '../../../components/Textarea'

type StoryBasicsFieldsProps = {
  categories: readonly string[]
  selectedCategory: string
  description: string
  descriptionError?: string
  onCategoryChange: (event: ChangeEvent<HTMLInputElement>) => void
  onDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onDescriptionInvalid: (event: InvalidEvent<HTMLTextAreaElement>) => void
}

function StoryBasicsFields({
  categories,
  selectedCategory,
  description,
  descriptionError,
  onCategoryChange,
  onDescriptionChange,
  onDescriptionInvalid,
}: StoryBasicsFieldsProps) {
  return (
    <>
      <fieldset>
        <legend className="type-card-title text-content-primary mb-3">Story Category</legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <RadioButton
              key={category}
              name="category"
              value={category}
              checked={selectedCategory === category}
              onChange={onCategoryChange}
            >
              {category}
            </RadioButton>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="story-description" className="type-card-title text-content-primary mb-3 block">
          Describe your story
        </label>
        <Textarea
          id="story-description"
          name="description"
          value={description}
          onChange={onDescriptionChange}
          placeholder="A brave little pirate who finds a magical compass that leads to a hidden island full of friendly sea creatures..."
          required
          onInvalid={onDescriptionInvalid}
          error={descriptionError}
        />
      </div>
    </>
  )
}

export default StoryBasicsFields
