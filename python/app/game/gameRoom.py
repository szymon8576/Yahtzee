points_categories = ["Ones", "Twos", "Threes", "Fours", "Fives", "Sixes", "Three of a Kind", "Four of a Kind", \
                    "Full House", "Small Straight", "Large Straight", "Yahtzee", "Chance", "Bonus", "Yahtzee Bonus"]


class GameRoom:
    def __init__(self, room_id):
        self.id = room_id
        self.player1, self.player2 = None, None
        self.points_board = [{category: [0,0]} for category in points_categories]
        self.marked_dices = []

    def get_state(self):
        return {
            "room_id": self.id,
            "players_ids": [self.player1 if self.player1 is not None else None,
                            self.player2 if self.player2 is not None else None],
            "points": self.points_board,
            "marked_dices": self.marked_dices,
        }

    def update_state(self, new_state):
        self.marked_dices = new_state["marked_dices"]
