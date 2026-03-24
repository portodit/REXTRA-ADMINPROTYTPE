export type RiasecCode = {
  id: number
  code: string
  title: string
  code_type: 'single' | 'double' | 'triple'
}

export type RiasecResponse = {
  data: RiasecCode[]
  total_codes: number
}
