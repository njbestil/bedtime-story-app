import { type ChangeEvent, type SubmitEvent, useState } from 'react'
import Input from '../../components/Input'
import RadioButton from '../../components/RadioButton'
import { GENDER_VALUES } from './settings.constants'
import type { SettingsFormChangeHandler, SettingsFormValues } from './settings.types'
import AppHeader from '../../components/layouts/AppHeader'
import Button from '../../components/Button'
import { useNavigate } from 'react-router'
import { APP_PATHS } from '../../routes/paths'
import { FaPencil } from 'react-icons/fa6'

const INITIAL_CHILD_PROFILE: SettingsFormValues = {
  name: 'Theodore',
  gender: 'boy',
  age: 4,
}

function SettingsScreen() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<SettingsFormValues>(INITIAL_CHILD_PROFILE)

  const updateField: SettingsFormChangeHandler = (field) => {
    return (event) => {
      setFormValues((currentValues) => ({
        ...currentValues,
        [field]: event.target.value,
      }))
    }
  }

  const handleAgeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const age = event.target.valueAsNumber

    setFormValues((currentValues) => ({
      ...currentValues,
      age: Number.isNaN(age) ? null : age,
    }))
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate(APP_PATHS.library)
  }

  const headerCenter = (
    <h1 className="type-brand text-brand-accent ">
      Settings
    </h1>
  )

  return (
    <>
      <AppHeader center={headerCenter} />
      <section
        className="flex min-h-[calc(100svh-2.75rem)] flex-col items-center justify-center py-6 text-center"
        aria-labelledby="settings-title"
      >
        <form id="settings-form" className="mt-6 w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
          <div className="text-center">
            <label htmlFor="child-name" className="type-card-title text-content-primary mb-2 block">
              Child&apos;s name
            </label>
            <Input
              className="text-center"
              id="child-name"
              name="name"
              value={formValues.name}
              onChange={updateField('name')}
              autoComplete="off"
            />
          </div>

          <div className="text-center">
            <label htmlFor="child-age" className="type-card-title text-content-primary mb-2 block">
              Age
            </label>
            <Input
              className="text-center"
              id="child-age"
              name="age"
              type="number"
              min="0"
              max="18"
              inputMode="numeric"
              value={formValues.age ?? ''}
              onChange={handleAgeChange}
            />
          </div>

          <fieldset className="flex flex-col items-center">
            <legend className="type-card-title text-content-primary mb-3">Gender</legend>
            <div className="flex flex-wrap gap-2 capitalize">
              {GENDER_VALUES.map((gender) => (
                <RadioButton
                  key={gender}
                  name="gender"
                  value={gender}
                  checked={formValues.gender === gender}
                  onChange={updateField('gender')}
                >
                  {gender}
                </RadioButton>
              ))}
            </div>
          </fieldset>
        </form>

        <div className="mt-20">
          <Button form="settings-form" type="submit" leadingIcon={<FaPencil />}>
            Save
          </Button>
        </div>
      </section>
    </>
  )
}

export default SettingsScreen
