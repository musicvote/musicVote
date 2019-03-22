const router = require('express').Router()
const {Song, PlaylistSong, Playlist} = require('../db/models')
const spotifyWebApi = require('spotify-web-api-node')
const {client_id, client_secret, redirect_uri} = require('../../secrets')
const axios = require('axios')
module.exports = router

const spotifyApi = new spotifyWebApi({
  clientID: process.env.SPOTIFY_CLIENT_ID || client_id,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || client_secret,
  callbackURL: process.env.SPOTIFY_CLIENT_ID || redirect_uri
})

spotifyApi.setAccessToken(
  'BQAAF7b5qetY8QRHHw_wfW-JQ6c7YxPjFc3o_i5fKq6qhcDwk1MAbh8pjVxNPD6Eq8hFlFzaPecMMYVKO3nLYLDdc2fBla2pz8l5lPPZzDALDHAjU3mf8yv-qeCZTk8YbpTYxWmGbS41muCl_JULNTK8iwCdErS4OfjuFsHlQEtyj8-i7vtwtqzhFQPhIxtMHOpYyZdO0m8zT3B0vIqJoCH2cJj-5dyyydBwYLaLFb8I4TmIaNQQrzmG19ZZ-d-MDNguAplqFAOov-OZTPkSn3VVy7WiRfywfkY'
)

const playlistId = '6UOF0Hq6ffLXnADFQxVKUH'

router.post('/addToPlaylist', (req, res, next) => {
  let songId = req.body.id

  spotifyApi
    .addTracksToPlaylist(playlistId, [`spotify:track:${songId}`], {
      position: 1
    })
    .then(
      data => {
        console.log(')))))))))) ', data)
        res.json(data)
      },
      err => {
        console.log('Something went wrong!', err)
      }
    )
    .catch(next)
})

router.get('/', async (req, res, next) => {
  try {
    const songList = await Song.findAll()
    res.status(200).send(songList)
  } catch (error) {
    next(error)
  }
})

router.get('/getSong', async (req, res, next) => {
  try {
    const song = await fetch(
      'https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl'
    )

    res.json(song.body.item)
  } catch (error) {
    next(error)
  }
})

//get songs from spotify
router.get('/search', async (req, res, next) => {
  //Playlist method - gets particular playlist
  //returns json object with all the tracks within a playlist
  try {
    const albumResult = await spotifyApi.getArtistAlbums(
      '43ZHCT0cAZBISjO8DG9PnE'
    )
    res.json(albumResult)
  } catch (error) {
    next(error)
  }
})


router.post('/addToPlaylist', (req, res, next) => {
  let songId = req.body.id
  spotifyApi
    .addTracksToPlaylist(playlistId, [`spotify:track:${songId}`])
    .then(
      data => {
        console.log(')))))))))) ', data)
        res.json(data)
      },
      err => {
        console.log('Something went wrong!', err)
      }
    )
    .catch(next)
})

router.get('/getCurrentlyPlaying', (req, res, next) => {
  spotifyApi
    .getMyCurrentPlayingTrack()
    .then(
      data => {
        // Output items
        console.log('%%%%%%: ', data.body.is_playing)
        res.json(data)
      },
      err => {
        console.log('Something went wrong!', err)
      }
    )
    .catch(next)
})

router.get('/searchSpotify/:searchTerm', async (req, res, next) => {
  try {
    const search = req.params.searchTerm
    const {data} = await axios.get(
      `https://api.spotify.com/v1/search?q=${search}&type=track`,
      {
        method: 'GET',
        headers: {Authorization: 'Bearer ' + accessToken},
        'Content-Type': 'application/json'
      }
    )
    const allItems = data.tracks.items.reduce((acc, item) => {
      let makeItem = {
        artist: item.artists[0].name,
        songName: item.name,
        songId: item.id,
        imageUrl: data.tracks.items[0].album.images[2].url
      }
      acc.push(makeItem)
      return acc
    }, [])

    res.json(allItems)
  } catch (error) {
    next(error)
  }
})

//returns all songs in the database
router.get('/:playlistId/searchDb', async (req, res, next) => {
  try {
    const playlistId = req.params.playlistId
    const allSongs = await PlaylistSong.findAll({
      where: {playlistId}
    })
    if (allsongs) {
      res.json(allSongs)
    } else {
      res.json('No songs in playlist')
    }
  } catch (error) {
    next(error)
  }
})

router.post('/:playlistId/addToDb', async (req, res, next) => {
  try {
    const playlistId = '6UOF0Hq6ffLXnADFQxVKUH'
    const selectedSong = req.body.selectedSong
    console.log(selectedSong)
    const addedSong = await Song.findOrCreate({
      where: {
        spotifySongID: selectedSong.songId,
        songName: selectedSong.songName,
        artistName: selectedSong.artist,
        albumArtworkurl: selectedSong.imageUrl
      }
    })
    const addedToJoinTable = await PlaylistSong.findOrCreate({
      where: {
        playlistSpotifyPlaylistId: playlistId,
        songSpotifySongID: selectedSong.songId,
        hasPlayed: true
      }
    })
    res.json({addedSong, addedToJoinTable})
  } catch (error) {
    next(error)
  }
})

router.get('/:playlistId', async (req, res, next) => {
  try {
    const playlistId = '6UOF0Hq6ffLXnADFQxVKUH'
    const singlePlaylist = await Playlist.findById(playlistId, {
      where: {
        spotifyPlaylistId: playlistId
      },
      include: [{model: Song}]
    })
    //need to eager load
    res.json(singlePlaylist)
  } catch (error) {
    next(error)
  }
})

