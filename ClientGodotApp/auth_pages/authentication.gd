extends Control


# Called when the node enters the scene tree for the first time.
func _ready():
	Firebase.Auth.login_succeeded.connect(on_login_succeeded)
	Firebase.Auth.login_failed.connect(on_login_failed)
	
	# If already logged in then just directly go into the game
	if Firebase.Auth.check_auth_file():
		$StateLabel.text = "Logged in"
		#get_tree().change_scene_to_file("res://Game.tscn")
	pass # Replace with function body.

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func on_login_succeeded(auth):
	print(auth)
	Firebase.Auth.save_auth(auth)
	Firebase.Auth.get_user_data()
	var user_data = await Firebase.Auth.userdata_received
	print(user_data)
	if user_data.email_verified:
		$StateLabel.text = "Login Success!"
	else:
		$StateLabel.text = "Login failed. Error: Email not verified"
	get_tree().change_scene_to_file("res://loading/loading_check_user_data.tscn")
	pass
	
func on_login_failed(error_code, message):
	print(error_code)
	print(message)
	$StateLabel.text = "Login failed. Error: %s" % message
	pass

func _on_login_button_pressed():
	var email = $EmailLineEdit.text
	var password = $PasswordLineEdit.text
	Firebase.Auth.login_with_email_and_password(email, password)
	$StateLabel.text = "Logging in..."
	pass # Replace with function body.


func _on_sign_up_button_pressed():
	get_tree().change_scene_to_file("res://auth_pages/signup.tscn")
	pass # Replace with function body.

func _on_reset_password_button_pressed():
	$EmailLineEdit.text = $EmailLineEdit.text.replace(" ", "")
	if $EmailLineEdit.text == "":
		$StateLabel.text = "Unable to send password reset email: Email field empty"
	else:
		Firebase.Auth.send_password_reset_email($EmailLineEdit.text)
		$StateLabel.text = "Password reset email sent."
	pass # Replace with function body.


func _on_web_test_button_pressed():
	OS.shell_open("..\\Client\\index.html")
	pass # Replace with function body.
