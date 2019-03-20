import React, {Component} from 'react'
import {findSongFromSpotify, postSongToPlaylist} from '../store/playlistStore'
import {connect} from 'react-redux'

class Searchbar extends Component {
  constructor() {
    super()
    this.state = {
      songName: '',
      foundSongs: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.submitSongHandler = this.submitSongHandler.bind(this)
  }

  async handleSubmit(event) {
    event.preventDefault()
    // this.props.addNewSongToPlaylist(this.state) !!!
    await this.props.findMatches(this.state.songName)
    console.log('7878787: ', this.props)
    this.setState({songName: '', foundSongs: this.props.searchResult})
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  submitSongHandler(event) {
    console.log('this is evt.target', event.target.value, this.props)
    const evtValArr = event.target.value.split('///')
    const repackagedObjFromEvtVal = {
      artist: evtValArr[0],
      songName: evtValArr[1],
      songId: evtValArr[2],
      imageUrl: evtValArr[3]
    }
    // this.props.songs.songPickedNowPost()
  }

  render() {
    return (
      <div id="searchbar">
        <div />
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            className="input"
            name="songName"
            placeholder="Search song name..."
            value={this.state.songName}
            onChange={this.handleChange}
          />
          <button className="submit-btn" type="submit">
            Submit
          </button>
        </form>

        {this.state.foundSongs.length ? (
          this.state.foundSongs.map(song => {
            return (
              <div key={song.songId}>
                <p key={song.songId}>{song.label}</p>
                <button
                  key={song.songId}
                  onClick={this.submitSongHandler}
                  type="button"
                  value={`${song.artist}///${song.songName}///${
                    song.songId
                  }///${song.imageUrl}`}
                >
                  add
                </button>
              </div>
            )
          })
        ) : (
          <div>Not found</div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    searchResult: state.songs.searchResult
  }
}

const mapDispatchToProps = dispatch => {
  return {
    findMatches: songName => dispatch(findSongFromSpotify(songName)),
    songPickedNowPost: songObj => dispatch(postSongToPlaylist(songObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Searchbar)
