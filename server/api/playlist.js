const router = require('express').Router()
const {Playlist, User} = require('../db/models')
module.exports = router

//create a playlist in our DB - when someone clicks "create playlist" - they will send us their playlist URL

router.get('/usersPlaylist', async (req, res, next) => {
  try {
    const userId = req.user.id
    const playlist = await Playlist.findOne({where: {userId}})
    if (playlist) {
      res.status(200).json(playlist.dataValues.spotifyPlaylistId)
    } else {
      res.send({isAdmin: false})
    }
  } catch (error) {
    console.log('error', error)
  }
})

router.post('/create-playlist', async (req, res, next) => {
  try {
    const playlistId = req.body.id
    const userId = req.user.id

    const matchedUser = await User.findOne({where: {id: userId}})

    const newPlaylist = await Playlist.create({
      spotifyPlaylistId: playlistId,
      userId: matchedUser.id
    })
    res.status(200).json(newPlaylist)
  } catch (error) {
    console.log('error', error)
  }
})

router.put('/:playlistId/vote/:songId', async (req, res, next) => {
  try {
    const songId = req.params.songId
    const playlistId = req.params.playlistId
    const updatedVoteCount = await PlaylistSong.update(
      {
        voteCount
      },
      {
        where: {
          songId,
          playlistId
        },
        returning: true,
        plain: true
      }
    )
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})
