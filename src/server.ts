const apiBase = Bun.env.API_BASE
const apiKey = Bun.env.API_KEY

const accessToken = await getAccessToken()

const steamIds = await getPlayers()

const courseIds = await getCourses()

setInterval(sendRecord, 2 * 1000)

async function getPlayers() {
  try {
    const res = await fetch(`${apiBase}/players`)

    if (res.status >= 400) {
      console.log(
        `api error:\n${res.status}:${await res.text()}`
      )
    } else {
      const { players } = await res.json()
      return players.map((player: any) => player.steam_id)
    }
  } catch (error) {
    console.log("error:\n", error)
  }
}

async function getCourses() {
  try {
    const res = await fetch(`${apiBase}/maps`)

    if (res.status >= 400) {
      console.log(`api error:\n${res.status}:${await res.text()}`)
    } else {
      const { maps } = await res.json()
      return maps.flatMap((map: any) =>
        map.courses.map((course: any) => course.id)
      )
    }
  } catch (error) {
    console.log("error:\n", error)
  }
}

async function getAccessToken() {
  try {
    const res = await fetch(`${apiBase}/servers/auth`, {
      method: "POST",
      body: JSON.stringify({
        key: apiKey,
        plugin_version: "0.0.1",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (res.status >= 400) {
      console.log(`error:${res.status}:${await res.text()}`)
    } else {
      const { token } = await res.json()
      return token
    }
  } catch (error) {
    console.log("error:\n", error)
  }
}

async function sendRecord() {
  const record = mockRecord()

  try {
    const res = await fetch(`${apiBase}/records`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    })

    if (res.status >= 400) {
      console.log(`api error:\n${res.status}:${await res.text()}`)
    } else {
      const data = await res.json()
      console.log(data)
    }
  } catch (error) {
    console.log("error:\n", error)
  }
}

function mockRecord() {
  return {
    course_id: courseIds[Math.floor(Math.random() * courseIds.length)],
    player_id: steamIds[Math.floor(Math.random() * steamIds.length)],
    mode: Math.random() > 0.5 ? "classic" : "vanilla",
    styles: ["normal"],
    teleports: Math.random() > 0.4 ? Math.floor(Math.random() * 1000) : 0,
    time: Number((Math.random() * 20 * 60).toFixed(3)),
    bhop_stats: {
      total: 0,
      perfect_perfs: 0,
      perfs: 0,
    },
  }
}
