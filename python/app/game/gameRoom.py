from datetime import datetime

categories = ['total', 'twos', 'fours', 'fullhouse', 'uppertabletotal', 'threes', 'fives',
              'largestraight', 'chance', 'yahtzee', 'sixes', 'bonus', 'ones', 'smallstraight', 'threeofakind', 'fourofakind']

player_cells = [c+"-1" for c in categories] + [c+"-2" for c in categories]

class GameRoom:
    def __init__(self, room_id):
        self.id = room_id
        self.player1, self.player2 = None, None
        self.scores = { c: 0 for c in player_cells}
        self.locked_scores = {}
        self.rolled_dices, self.marked_dices = [], []
        self.last_time_joined = datetime(2000, 1, 1, 0, 0, 0)
        self.current_player = 1

    def get_state(self):
        return {
            "room_id": self.id,
            "players_ids": [self.player1 if self.player1 is not None else None,
                            self.player2 if self.player2 is not None else None],
            "current_player": self.current_player,
            "scores": self.scores,
            "lockedDices": self.marked_dices,
            "rolledDices": self.rolled_dices,
            "scoreFields": self.locked_scores,
            "last_time_joined": str(self.last_time_joined),
        }

    def update_state(self, new_state):
        self.marked_dices = new_state["lockedDices"]
        self.rolled_dices = new_state["rolledDices"]
        self.locked_scores = new_state["scoreFields"]
        self.scores.update(new_state["scores"])

        if new_state["player_change"]:
            self.current_player = 2 if self.current_player == 1 else 2

        print("State updated")
