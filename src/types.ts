export type Tier =
  | "very_easy"
  | "easy"
  | "medium"
  | "advanced"
  | "hard"
  | "very_hard"
  | "extreme"
  | "death"
  | "unfeasible"
  | "impossible"

export type Mode = "classic" | "vanilla"

export type Style = "normal" | "sideways"

export type RankedStatus = "never" | "unranked" | "ranked"

export type GlobalStatus = "global" | "not_global" | "in_testing"

export interface Player {
  name: string
  steam_id: string
  is_banned: boolean
}

export interface Filter {
  id: number
  mode: Mode
  teleports: boolean
  tier: Tier
  ranked_status: RankedStatus
  notes?: string
}

export interface Course {
  id: number
  name?: string
  description?: string
  filters: Filter[]
  mappers: Player[]
}

export interface Map {
  id: number
  name: string
  description?: string
  global_status: GlobalStatus
  checksum: number
  workshop_id: number
  courses: Course[]
  mappers: Player[]
  created_on: string
}

export interface Record {
  id: number
  player: {
    steam_id: string
    name: string
  }
  map: {
    id: number
    name: string
  }
  server: {
    id: number
    name: number
  }
  mode: "vanilla" | "classic"
  ranked_status: boolean
  style: string
  teleports: number
  time: number
  bhop_stats: {
    perfs: number
    tick0: number
    tick1: number
    tick2: number
    tick3: number
    tick4: number
    tick5: number
    tick6: number
    tick7: number
    tick8: number
  }
  plugin_version: string
  created_on: string
}

export interface RecordToInsert {
  course_id: number
  player_id: string
  mode: string
  styles: Style[]
  teleports: number
  time: number
  bhop_stats: {
    perfs: number
    tick0: number
    tick1: number
    tick2: number
    tick3: number
    tick4: number
    tick5: number
    tick6: number
    tick7: number
    tick8: number
  }
}
