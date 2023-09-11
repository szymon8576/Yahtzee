import random
from .gameRoom import *
from .playersAccumulator import *


class GameRoomAccumulator:

    def __init__(self, n_rooms=10):
        self.rooms = [GameRoom(room_id=room_id) for room_id in range(n_rooms)]
        self.players = PlayersAccumulator()

    def join_room(self, room_id):

        try:
            room = self.rooms[room_id]

        except IndexError as _:
            return f"Invalid room ID: {room_id}", 400

        if room.player2 is not None:
            return f"Room {room_id} is full", 400

        player = self.players.create_player()

        if room.player1 is None:
            room.player1 = player
            return {"STATE": "WAIT_FOR_OPPONENT", "player_id": player.id }, 200
        else:
            room.player2 = player
            return {"STATE": "START_THE_GAME",
                    "player_id": player.id,
                    "players_ids": [room.player1.id, room.player2.id]}, 200

    def get_rooms_ids(self):
        return [room.id for room in self.rooms]

    def get_room_state(self, room_id):

        if room_id not in self.get_rooms_ids():
            return f"Invalid room ID: {room_id}", 400

        return self.rooms[room_id].get_state(), 200
