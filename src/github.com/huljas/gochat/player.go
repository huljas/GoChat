package main

import (
)

type Player struct {
	Id   int    `json:"id"`
	Nick string `json:"nick"`
}

type PlayerService interface {
	Create(nick string) *Player

	Update(id int, nick string) *Player

	List() []*Player

	Find(nick string) *Player

	Get(id int) *Player
}

func GetPlayerService() PlayerService {
    players := make([]*Player, 0)
    return &LocalPlayerService{1, players}
}

/**
 * Service which keeps the players in memory
 */
type LocalPlayerService struct {
	index   int
	players []*Player
}

func (self *LocalPlayerService) Create(nick string) *Player {
	found := self.Find(nick)
	if found == nil {
		player := &Player{self.index, nick}
		self.index = self.index + 1
		self.players = append(self.players, player)
		return player
	} else {
		return nil
	}
}

func (self *LocalPlayerService) Update(id int, nick string) *Player {
	found := self.Get(id)
	if found != nil {
		found.Nick = nick
		return found
	} else {
		return nil
	}
}

func (self *LocalPlayerService) List() []*Player {
	return self.players
}

func (self *LocalPlayerService) Find(nick string) *Player {
	for _, player := range self.players {
		if player.Nick == nick {
			return player
		}
	}
	return nil
}

func (self *LocalPlayerService) Get(id int) *Player {
	for _, player := range self.players {
		if player.Id == id {
			return player
		}
	}
	return nil
}
