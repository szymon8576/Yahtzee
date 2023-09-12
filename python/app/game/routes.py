from flask import Blueprint, jsonify, request
from .gameRoomsAccumulator import *
from .. import socketio
from flask_socketio import join_room, leave_room, send, emit, ConnectionRefusedError

game_bp = Blueprint('game', __name__)

gameRooms = GameRoomAccumulator()


# TODO separate routes (routes.py) and websockets (events.py)

@game_bp.route('/get-rooms-data/<int:room_id>', methods=["GET"])
@game_bp.route('/get-rooms-data', methods=["GET"])
def get_rooms_data(room_id=None):
    if room_id is None:
        data = {room.id: room.get_state() for room in gameRooms.rooms}
        return jsonify(data)
    else:
        return jsonify(gameRooms.rooms[room_id].get_state())


@socketio.on('connect')
def handle_connect():
    room_id, user_uuid = int(request.args.get('room_id')), request.args.get('user_uuid')

    message, join_successful = gameRooms.check_if_can_join_room(room_id, user_uuid)

    if join_successful:
        join_room(room_id)  # join websocket room
        join_result_data = gameRooms.assign_player_to_room(room_id, user_uuid)  # join game room
        emit("update_game_state", join_result_data, room=room_id)

    else:
        raise ConnectionRefusedError(message)


@socketio.on('disconnect')
def handle_disconnect():
    room_id, user_uuid = int(request.args.get('room_id')), request.args.get('user_uuid')
    leave_room(room_id)
    gameRooms.remove_player_from_room(room_id, user_uuid)


@socketio.on('update_game_state')
def handle_update_game_state(data):
    room_id, user_uuid, new_state = data["room_id"], data["user_uuid"], data["new_state"]

    updated_state = gameRooms.update_room_state(room_id, user_uuid, new_state)
    emit('game_state_update', updated_state, room=room_id)
