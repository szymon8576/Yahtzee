from flask import Blueprint, jsonify, request
from .gameRoomsAccumulator import *
from .. import socketio
from flask_socketio import join_room, leave_room, send, emit, ConnectionRefusedError, disconnect

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


@game_bp.route('/create-table', methods=["POST"])
def create_room():
    user_uuid = request.get_json().get('user_uuid')

    if len(user_uuid) == 0:
        return jsonify({"message": "Please provide valid UUID."}), 403
    if len(gameRooms.getRoomsByUser(user_uuid))>5:
        return jsonify({"message": "You have reached max number of rooms per user."}), 403

    room_id = gameRooms.get_vacant_room_id()

    if room_id is not None:
        gameRooms.assign_player_to_room(room_id, user_uuid, position=1)
        return jsonify({"table_id": room_id})
    else:
        return jsonify({"error": "There are no vacant rooms left"})


@game_bp.route('/join-table', methods=["POST"])
def join_gameroom():
    data = request.get_json()
    user_uuid, table_id = data.get('user_uuid'), int(data.get('table_id'))
    message, status = gameRooms.check_if_can_join_table(table_id, user_uuid)

    if status is True:
        gameRooms.assign_player_to_room(table_id, user_uuid, position=2)
        return jsonify({f"You can join the room now. User who created table {table_id}": gameRooms.rooms[table_id].player1})
    else:
        return jsonify(message), 403


@socketio.on('connect')
def handle_connect():
    user_uuid, room_id = request.args.get('user_uuid'), int(request.args.get('room_id'))

    message, status = gameRooms.check_credentials(room_id, user_uuid)
    if not status:
        raise ConnectionRefusedError(message)

    print(f"User {user_uuid} joined room {room_id}")
    join_room(room_id)

    if gameRooms.check_if_two_players_in_room(room_id):
        emit('update', gameRooms.get_room_state(room_id), room=room_id)
    else:
        emit('update', {}, room=room_id)


@socketio.on('update')
def handle_update_game_state(data):
    print("Update socket-io request, ", data)
    room_id, user_uuid, new_state = int(data["table_id"]), data["user_uuid"], data["new_state"]

    message, status = gameRooms.check_credentials(room_id, user_uuid)
    if not status:
        disconnect()

    updated_state = gameRooms.update_room_state(room_id, new_state)
    emit('update', updated_state, room=room_id)
