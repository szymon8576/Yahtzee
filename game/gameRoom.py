points_categories = ["Ones", "Twos", "Threes", "Fours", "Fives", "Sixes", "Three of a Kind", "Four of a Kind", \
                    "Full House", "Small Straight", "Large Straight", "Yahtzee", "Chance", "Bonus", "Yahtzee Bonus"]


class GameRoom:
    def __init__(self, room_id):
        self.id = room_id
        self.player1, self.player2 = None, None
        self.points_board = [{category: [0,0]} for category in points_categories]

    def get_state(self):
        return {
            "room_id": self.id,
            "players_ids": [self.player1.id, self.player2.id],
            "points": self.points_board
        }

    def apply_points(self, player_num, points, category):
        self.points_board[category][player_num] = points
