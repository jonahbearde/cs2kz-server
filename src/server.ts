import type { RecordToInsert, Player, Map } from "./types.ts"

const apiBase = Bun.env.API_BASE
const apiKey = Bun.env.API_KEY

const accessKey = await getAccessKey()

const steamIds = await getPlayers()

const courseIds = await getCourses()

setInterval(sendRecord, 2 * 1000)

async function getPlayers() {
  try {
    const res = await fetch(`${apiBase}/players`)

    if (res.status >= 400) {
      console.log(`error:${res.status}:${await res.text()}`)
    } else {
      const { results } = await res.json()
      return results.map((player: Player) => player.steam_id)
    }
  } catch (error) {
    console.log("can't get players", error)
  }
}

async function getCourses() {
  try {
    const res = await fetch(`${apiBase}/maps`)

    if (res.status >= 400) {
      console.log(`error:${res.status}:${await res.text()}`)
    } else {
      const { results } = await res.json()
      return results.flatMap((map: Map) =>
        map.courses.map((course) => course.id)
      )
    }
  } catch (error) {
    console.log("can't get maps", error)
  }
}

async function getAccessKey() {
  try {
    const res = await fetch(`${apiBase}/servers/key`, {
      method: "POST",
      body: JSON.stringify({
        refresh_key: apiKey,
        plugin_version: "0.0.1",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (res.status >= 400) {
      console.log(`error:${res.status}:${await res.text()}`)
    } else {
      const { access_key } = await res.json()
      return access_key
    }
  } catch (error) {
    console.log("can't get access key", error)
  }
}

async function sendRecord() {
  const record = mockRecord()

  try {
    const res = await fetch(`${apiBase}/records`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    })

    if (res.status >= 400) {
      console.log(`error:${res.status}:${await res.text()}`)
    } else {
      const data = await res.json()
      console.log(data)
    }
  } catch (error) {
    console.log("can't send record", error)
  }
}

function mockRecord(): RecordToInsert {
  return {
    course_id: courseIds[Math.floor(Math.random() * courseIds.length)],
    player_id: steamIds[Math.floor(Math.random() * steamIds.length)],
    mode: Math.random() > 0.5 ? "classic" : "vanilla",
    styles: ["normal"],
    teleports: Math.random() > 0.4 ? Math.floor(Math.random() * 1000) : 0,
    time: Number((Math.random() * 20 * 60).toFixed(3)),
    bhop_stats: {
      bhops: 1000,
      perfs: 1000,
    },
  }
}
