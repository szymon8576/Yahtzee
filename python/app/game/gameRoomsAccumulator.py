import random
from .gameRoom import *
from .playersAccumulator import *


class GameRoomAccumulator:

    def __init__(self, n_rooms=10):
        self.rooms = [GameRoom(room_id=room_id) for room_id in range(n_rooms)]
        self.players = PlayersAccumulator()

    def check_if_can_join_room(self, room_id, user_uuid):

        if room_id not in self.get_rooms_ids():
            return {"message": f"Invalid room ID: {room_id}"}, False

        room = self.rooms[room_id]

        if room.player1 is not None and room.player2 is not None:
            return {"message": f"Room {room_id} is full"}, False

        if room.player1 == user_uuid:
            return {"message": f"User {user_uuid} is already in room {room_id}"}, False

        return {"message": f"You can join room {room_id}"}, True

    def assign_player_to_room(self, room_id, user_uuid):

        room = self.rooms[room_id]

        if room.player1 is None:  # waiting for opponent
            room.player1 = user_uuid
            return {"message": "WAIT_FOR_OPPONENT"}
        else:                    # assigning second player and starting the game
            room.player2 = user_uuid
            return self.rooms[room_id].get_state()

    def remove_player_from_room(self, room_id, user_uuid):

        room = self.rooms[room_id]

        if room.player1 == user_uuid:
            room.player1 = None
        elif room.player2 == user_uuid:
            room.player2 = None
        else:
            raise AssertionError("Trying to remove user that is not in the room")

    def get_rooms_ids(self):
        return [room.id for room in self.rooms]

    def get_room_state(self, room_id, user_uuid):

        if room_id not in self.get_rooms_ids():
            return {"message": f"Invalid room ID: {room_id}"}

        if self.rooms[room_id].player1 != user_uuid and self.rooms[room_id].player2 != user_uuid:
            return {"message": "Given user has no permission to get this room state"}

        return self.rooms[room_id].get_state()

    def update_room_state(self, room_id, user_uuid, new_state):
        if room_id not in self.get_rooms_ids():
            return {"message": f"Invalid room ID: {room_id}"}

        if self.rooms[room_id].player1 != user_uuid and self.rooms[room_id].player2 != user_uuid:
            return {"message": "Given user has no permission to modify this room state"}

        self.rooms[room_id].update_state(new_state)

        return self.rooms[room_id].get_state()
