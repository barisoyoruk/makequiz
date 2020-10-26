from rest_framework import serializers
from main.models import (
	User, Teacher, Student, Section, Quiz, 
	Question, Assignment, Answer, Submission, Result
)

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['first_name', 'last_name', 'email']

class TeacherSerializer(serializers.ModelSerializer):
	user = UserSerializer()
	section = serializers.PrimaryKeyRelatedField(read_only = True, many = True)
	quiz = serializers.PrimaryKeyRelatedField(read_only = True, many = True)

	class Meta:
		model = Teacher
		fields = ['user', 'teacher_ID', 'teacher_field', 'section', 'quiz']

class StudentSerializer(serializers.ModelSerializer):
	user = UserSerializer()
	section = serializers.PrimaryKeyRelatedField(read_only = True, many = True)
	assignment = serializers.PrimaryKeyRelatedField(read_only = True, many = True)
	submission = serializers.PrimaryKeyRelatedField(read_only = True, many = True)

	class Meta:
		model = Student
		fields = ['user', 'student_ID', 'student_class', 'section', 'assignment', 'submission']

class SectionSerializer(serializers.ModelSerializer):
	teacher = serializers.PrimaryKeyRelatedField(read_only = True)
	students = serializers.PrimaryKeyRelatedField(read_only = True, many = True)

	class Meta:
		model = Section
		fields = ['section_code', 'semester_time', 'teacher', 'students']

class QuizSerializer(serializers.ModelSerializer):
	teacher = serializers.PrimaryKeyRelatedField(read_only = True)

	class Meta:
		model = Quiz
		fields = ['quiz_topic', 'quiz_field', 'quiz_no', 'teacher']


class QuestionSerializer(serializers.ModelSerializer):
	quiz = serializers.PrimaryKeyRelatedField(read_only = True)

	class Meta:
		model = Question
		fields = ['quiz', 'question_prompt', 'question_worth']

class AssignmentSerializer(serializers.ModelSerializer):
	student = serializers.PrimaryKeyRelatedField(read_only = True)
	quiz = serializers.PrimaryKeyRelatedField(read_only = True)

	class Meta:
		model = Assignment
		fields = ['student', 'quiz', 'publication_date', 'due_date']

class AnswerSerializer(serializers.ModelSerializer):
	question = serializers.PrimaryKeyRelatedField(read_only = True)

	class Meta:
		model = Answer
		fields = ['answer_text', 'question']

class SubmissionSerializer(serializers.ModelSerializer):
	quiz = serializers.PrimaryKeyRelatedField(read_only = True)
	student = serializers.PrimaryKeyRelatedField(read_only = True)
	answer = serializers.PrimaryKeyRelatedField(read_only = True, many = True)

	class Meta:
		model = Submission
		fields = ['quiz', 'student', 'answer']	

class ResultSerializer(serializers.ModelSerializer):
	submission = serializers.PrimaryKeyRelatedField(read_only = True)

	class Meta:
		model = Result
		fields = ['submission', 'grade', 'feedback']

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
			email = self.validated_data['email'], 
			first_name = self.validated_data['first_name'],
			last_name = self.validated_data['last_name'])
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
		user_serializer = UserRegistrationSerializer(data = user_data)

		if user_serializer.is_valid():
			new_user = user_serializer.save()
			new_teacher = Teacher.objects.create(user = new_user, **validated_data)
		return new_teacher

class StudentRegistrationSerializer(serializers.ModelSerializer):
	user = UserRegistrationSerializer()

	class Meta:
		model = Student
		fields = ['user', 'student_ID', 'student_class']

	def create(self, validated_data):
		user_data = validated_data.pop('user')
		user_serializer = UserRegistrationSerializer(data = user_data)

		if user_serializer.is_valid():
			new_user = user_serializer.save()
			student = Student.objects.create(user = new_user, **validated_data)
		return student

class SectionCreateSerializer(serializers.ModelSerializer):
	teacher_pk = serializers.IntegerField()

	class Meta:
		model = Section
		fields = ['teacher_pk', 'section_code', 'semester_time']

	def create(self, validated_data):
		teacher_pk_data = validated_data.pop('teacher_pk')

		try:
			teacher = Teacher.objects.get(pk = teacher_pk_data)
		except Teacher.DoesNotExist:
			raise serializers.ValidationError({'teacher_pk':'There is no teacher with this pk'})

		section = Section.objects.create(teacher = teacher, **validated_data)
		return section

class SectionStudentAdditionSerializer(serializers.ModelSerializer):
	students = serializers.JSONField()


	class Meta:
		model = Section
		fields = ['students']

	def save(self):
		student_pk_data = self.validated_data.pop('students')

		try:
			student = Student.objects.get(pk = student_pk_data)
		except Student.DoesNotExist:
			raise serializers.ValidationError({'students':'There is no student with this pk'})

		if not student in self.instance.students.all():
			self.instance.students.add(student)
			return self.instance
		else:
			raise serializers.ValidationError({'students':'Student already exist in the section'})

class QuizCreateSerializer(serializers.Serializer):
	teacher_pk = serializers.IntegerField()

	class Meta:
		model = Quiz
		fields = ['teacher_pk', 'quiz_topic', 'quiz_field', 'quiz_no']

	def save(self):
		teacher_pk_data = self.validated_data.pop('teacher_pk')

		try: 
			teacher = Teacher.objects.get(pk = teacher_pk_data)
		except Teacher.DoesNotExist:
			raise serializers.ValidationError({'teacher_pk':'There is no teacher with this pk'})

		quiz = Quiz.objects.create(teacher = teacher, **self.validated_data)
		return quiz

class QuestionCreateSerializer(serializers.ModelSerializer):
	quiz_pk = serializers.IntegerField()

	class Meta:
		model = Question
		fields = ['quiz_pk', 'question_prompt', 'question_worth']

	def save(self):
		quiz_pk_data = self.validated_data.pop('quiz_pk')

		try:
			quiz = Quiz.objects.get(pk = quiz_pk_data)
		except Quiz.DoesNotExist:
			raise serializers.ValidationError({'teacher_pk':'There is no teacher with this pk'})

		question = Question.objects.create(quiz = quiz, **self.validated_data)
		return question