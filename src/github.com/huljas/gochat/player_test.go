package main

import (
	"testing"
)

func TestPlayerCreate(t *testing.T) {
	var service PlayerService = GetPlayerService()
	player := service.Create("foobar")
	if player == nil {
		t.Fatalf("player creation failed")
	}
	if service.Find(player.Nick) == nil {
		t.Fatalf("player should be found with nick")
	}
	if service.Get(player.Id) == nil {
		t.Fatalf("player should be found with id")
	}
}

func TestPlayerDuplicateCreate(t *testing.T) {
	var service PlayerService = GetPlayerService()
	service.Create("foobar")
	if service.Create("foobar") != nil {
		t.Fatalf("duplicate creation should fail")
	}
}

func TestListPlayers(t *testing.T) {
	var service PlayerService = GetPlayerService()
	service.Create("foobar")
	service.Create("juujaa")
	service.Create("huuhaa")
	players := service.List()
	if len(players) != 3 {
		t.Fatalf("should have THREE players, not %d", len(players))
	}
	if players[0].Nick != "foobar" {
		t.Fatalf("nick should match %s but was %s", "foobar", players[0].Nick)
	}
	if players[1].Nick != "juujaa" {
		t.Fatalf("nick should match %s but was %s", "juujaa", players[1].Nick)
	}
	if players[2].Nick != "huuhaa" {
		t.Fatalf("nick should match %s but was %s", "huuhaa", players[2].Nick)
	}
}

func TestUpdatePlayer(t *testing.T) {
	var service PlayerService = GetPlayerService()
	player := service.Create("foobar")
	service.Update(player.Id, "barbar")
	found := service.Get(player.Id)
	if found.Nick != "barbar" {
		t.Fatalf("nick should be updated")
	}
}
