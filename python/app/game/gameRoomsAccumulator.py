import random
from .gameRoom import *
from .playersAccumulator import *
from datetime import datetime


class GameRoomAccumulator:

    def __init__(self, n_rooms=100):
        self.rooms = [GameRoom(room_id=room_id) for room_id in range(n_rooms)]
        self.players = PlayersAccumulator()

    def check_if_can_join_table(self, room_id, user_uuid):

        if room_id not in self.get_rooms_ids():
            return {"message": f"Invalid room ID: {room_id}"}, False

        room = self.rooms[room_id]

        if room.player1 is None:
            return {"message": f"Room {room_id}  hasn't been created yet."}, False

        if room.player1 is not None and room.player2 is not None:
            return {"message": f"Room {room_id} is full"}, False

        if room.player1 == user_uuid:
            return {"message": f"User {user_uuid} is already in room {room_id}"}, False

        return {"message": f"You can join room {room_id}"}, True

    def check_credentials(self, room_id, user_uuid):

        if room_id is None or user_uuid is None:
            return f"Room ID and user UUID cant be empty", False

        if room_id not in self.get_rooms_ids():
            return f"Room {room_id} does not exist", False

        room = self.rooms[room_id]
        if user_uuid not in [room.player1, room.player2]:
            return f"User {user_uuid} is not assigned to room {room_id}", False

        return "OK", True

    def assign_player_to_room(self, room_id, user_uuid, position):

        room = self.rooms[room_id]

        if position == 1:
            room.player1 = user_uuid
            room.last_time_joined = datetime.now()
        else:
            room.player2 = user_uuid

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

    def get_room_state(self, room_id):

        return self.rooms[room_id].get_state()

    def check_if_two_players_in_room(self, room_id):
        if self.rooms[room_id].player1 and self.rooms[room_id].player2:
            return True
        else:
            return False


    def update_room_state(self, room_id, new_state):

        self.rooms[room_id].update_state(new_state)
        return self.rooms[room_id].get_state()

    def get_vacant_room_id(self):
        for room in self.rooms:
            if not room.is_active:
                return room.id
        return None

    def getRoomsByUser(self, user_uuid):
        return [room for room in self.rooms if (room.player1 == user_uuid and room.is_active)]

