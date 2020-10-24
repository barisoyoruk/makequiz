from rest_framework import serializers
from main.models import Teacher, Student, Quiz, Question, User, Section

class QuestionSerializer(serializers.ModelSerializer):

	quiz = serializers.StringRelatedField()

	class Meta:
		model = Question
		field = [ 'quiz', 'question_text', 'question_answer', 'question_worth' ]

class QuizSerializer(serializers.ModelSerializer):

	questions = QuestionSerializer(many=True)
	sections = serializers.StringRelatedField(many=True)

	class Meta:
		model = Quiz
		field = [ 'quiz_topic', 'quiz_field', 'quiz_no', 'grade', 'publication_date', 'due_date', 'quiz_status', 'questions', 'section' ]

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = [ 'first_name', 'last_name', 'email' ]

class TeacherSerializer(serializers.ModelSerializer):

	user = UserSerializer(read_only=True)

	class Meta:
		model = Teacher
		fields = [ 'user', 'teacher_ID', 'teacher_field', 'quizes' ]


class StudentSerializer(serializers.ModelSerializer):

	user = UserSerializer(read_only=True)

	class Meta:
		model = Student
		fields = [ 'user', 'student_ID', 'student_class', 'quizes' ]

class UserRegistrationSerializer(serializers.ModelSerializer):
	password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

	class Meta:
		model = User
		fields = [ 'first_name', 'last_name', 'email', 'password', 'password2']
		extra_kwargs = {
			'password': {'write_only': True}
		}

	def save(self):
		user = User(
			email=self.validated_data['email'], 
			first_name=self.validated_data['first_name'],
			last_name=self.validated_data['last_name'])
		password = self.validated_data['password']
		password2 = self.validated_data['password2']

		if password != password2:
			raise serializers.ValidationError({'password':'Password must match.'})
		user.set_password(password)
		user.save()
		return user

class TeacherRegistrationSerializer(serializers.ModelSerializer):

	user = UserRegistrationSerializer()

	class Meta:
		model = Teacher
		fields = ['user', 'teacher_ID', 'teacher_field']

	def create(self, validated_data):
		user_data = validated_data.pop('user')
		new_user = UserRegistrationSerializer(data = user_data)

		if new_user.is_valid():
			new_user = new_user.save()
			teacher = Teacher.objects.create(user = new_user, **validated_data)
		return teacher

class StudentRegistrationSerializer(serializers.ModelSerializer):
	user = UserRegistrationSerializer()

	class Meta:
		model = Student
		fields = ['user', 'teacher_ID', 'teacher_field']

	def create(self, validated_data):
		user_data = validated_data.pop('user')
		new_user = UserRegistrationSerializer(data = user_data)

		if new_user.is_valid():
			new_user = new_user.save()
			student = Student.objects.create(user = new_user, **validated_data)
		return teacher

class SectionSerializer(serializers.ModelSerializer):

	teacher = serializers.StringRelatedField()
	students = serializers.StringRelatedField(many=True)
	quizes = serializers.StringRelatedField(many=True)

	class Meta:
		model = Section
		field = ['section_code', 'teacher', 'students', 'quizes']