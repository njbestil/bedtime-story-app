import type { ChangeEvent } from 'react'
import type { GENDER_VALUES } from './settings.constants'

export type SettingsFormValues = {
  name: string
  gender: (typeof GENDER_VALUES)[number]
  age: number | null
}

export type SettingsTextField = 'name' | 'gender'

export type SettingsFormChangeEvent = ChangeEvent<HTMLInputElement>

export type SettingsFormChangeHandler = (
  field: SettingsTextField,
) => (event: SettingsFormChangeEvent) => void
