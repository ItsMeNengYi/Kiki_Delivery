extends Control


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
	
func save_user_data(new_username):
	$StateLabel.text = "Saving user data..."
	var auth = Firebase.Auth.auth
	if auth.localid:
		var firestore_collection: FirestoreCollection = Firebase.Firestore.collection("user_data")
		# connect error/success signals
		firestore_collection.add_document.connect(on_save_success)
		firestore_collection.update_document.connect(on_save_success)
		firestore_collection.error.connect(on_save_error)
		# get user data here (so that we can get the email)
		Firebase.Auth.get_user_data()
		var user_data = await Firebase.Auth.userdata_received
		var data_to_save: Dictionary = {
			"username": new_username,
			"email": user_data.email,
			"friends_list": []
		}
		var task: FirestoreTask  = firestore_collection.update(auth.localid, data_to_save)
		var document = await task.task_finished
		print(document)
		$StateLabel.text = "User data saved!"
		get_tree().change_scene_to_file("res://loading/loading_check_game_data.tscn")

func on_save_success():
	$StateLabel.text = "User data saved!"
	pass
	
func on_save_error():
	$StateLabel.text = "User data saving failed, please check internet connection"
	pass

func _on_set_username_button_pressed():
	$StateLabel.text = "Checking..."
	
	# check username formatting
	if $UsernameLineEdit.text.contains(" "):
		$StateLabel.text = "Username cannot have spaces"
		return
	if $UsernameLineEdit.text.length() < 6:
		$StateLabel.text = "Username must be at least 6 characters"
		return
	$UsernameLineEdit.text = $UsernameLineEdit.text.replace(" ", "")
	if $UsernameLineEdit.text == "":
		$StateLabel.text = "Username cannot be empty"
		return
	
	var new_username: String = $UsernameLineEdit.text
	
	# check if username exists
	var query : FirestoreQuery = FirestoreQuery.new().from("user_data").where("username", FirestoreQuery.OPERATOR.EQUAL, new_username).limit(10)
	var result: Array = await Firebase.Firestore.query(query).result_query
	if result.size() > 0:
		$StateLabel.text = "Username already exists!"
		return
	save_user_data(new_username)
