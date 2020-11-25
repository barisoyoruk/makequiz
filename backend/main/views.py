from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from main.models import User, Teacher, Student, Section, Quiz, Question, Assignment, Answer, Submission, Result
from main.serializers import (
	TeacherSerializer,
	StudentSerializer,
	SectionSerializer,
	QuizSerializer,
	QuestionSerializer,
	AssignmentSerializer,
	AnswerSerializer,
	SubmissionSerializer,
	ResultSerializer,
	TeacherRegistrationSerializer,
	StudentRegistrationSerializer,
	SectionCreateSerializer,
	SectionStudentAdditionSerializer,
	QuizCreateSerializer,
	QuestionCreateSerializer,
	AssignmentCreateSerializer,
	SubmissionCreateSerializer,
	AnswerCreateSerializer,
	ResultCreateSerializer
	)

#Views for GET and DELETE
@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def api_detail_teacher_view(request, pk): 

	try:
		teacher = Teacher.objects.get(pk=pk)
	except Teacher.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = TeacherSerializer(teacher)
		return Response(serializer.data)
	elif request.method == 'DELETE':
		auth_user = request.user
		try:
			auth_teacher = auth_user.teacher
		except Teacher.DoesNotExist:
			auth_teacher = None

		if auth_teacher & teacher.id == auth_teacher.id:
			operation = teacher.delete()
			data = {}
			if operation:
				data["success"] = "delete successful"
			else:
				data["failure"] = "delete failed"
			return Response(data=data)
		else:
			return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def api_detail_student_view(request, pk):

	try:
		student = Student.objects.get(pk=pk)
	except Student.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	
	if request.method == 'GET':
		serializer = StudentSerializer(student)
		return Response(serializer.data)
	elif request.method == 'DELETE':
		auth_user = request.user
		try:
			auth_student = auth_user.student
		except Student.DoesNotExist:
			auth_student = None

		if auth_student & student.id == auth_student.id:
			operation = student.delete()
			data = {}
			if operation:
				data["success"] = "delete successful"
			else:
				data["failure"] = "delete failed"
			return Response(data=data)
		else:
			return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def api_detail_section_view(request, pk):

	try:
		section = Section.objects.get(pk = pk)
	except Section.DoesNotExist:
		return Response(status = status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = SectionSerializer(section)
		return Response(serializer.data)

	user = request.user
	try:
		teacher = user.teacher
	except Teacher.DoesNotExist:
		return Response(status=status.HTTP_400_BAD_REQUEST)

	if section in teacher.section.all():
		if request.method == 'DELETE':
			operation = section.delete()
			data = {}
			if operation:
				data["success"] = "delete successful"
			else:
				data["failure"] = "delete failed"
			return Response(data = data)
		elif request.method == 'PUT':
			student_email = request.data['students'][0]

			try:
				student = User.objects.get(email=student_email)
			except User.DoesNotExist:
				return Response(status=status.HTTP_404_NOT_FOUND)
			except User.student.RelatedObjectDoesNotExist:
				return Response(status=status.HTTP_400_BAD_REQUEST)

			student_pk_data = {"students": [student.student.id]}
			serializer = SectionStudentAdditionSerializer(section, data=student_pk_data)
			if serializer.is_valid():
				serializer.save()
				serializer = StudentSerializer(student.student)
				return Response(serializer.data)
			return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
		return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def api_detail_quiz_view(request, pk):

	try:
		quiz = Quiz.objects.get(pk = pk)
	except quiz.DoesNotExist:
		return Response(status = status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = QuizSerializer(quiz)
		return Response(serializer.data)

	user = request.user
	try:
		teacher = user.teacher
	except Teacher.DoesNotExist:
		return Response(status=status.HTTP_400_BAD_REQUEST)

	if quiz in teacher.quiz.all():
		if request.method == 'DELETE':
			operation = quiz.delete()
			data = {}
			if operation:
				data["success"] = "delete successful"
			else:
				data["failure"] = "delete failed"
			return Response(data = data)
	
	return Response(status=status.HTTP_400_BAD_REQUEST)

class QuestionViewSet(generics.RetrieveDestroyAPIView):
	serializer_class = QuestionSerializer
	queryset = Question.objects.get_queryset()
	permission_classes = [IsAuthenticated]

	def perform_destroy(self, instance):
		user = self.request.user
		try:
			teacher = user.teacher
		except Teacher.DoesNotExist:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		if instance.quiz in teacher.quiz.all():
			operation = instance.delete()
			data = {}
			if operation:
				data["success"] = "delete successful"
			else:
				data["failure"] = "delete failed"
			return Response(data = data)
		return Response(status=status.HTTP_400_BAD_REQUEST)


class AssignmentViewSet(generics.RetrieveDestroyAPIView):
	serializer_class = AssignmentSerializer
	queryset = Assignment.objects.get_queryset()
	permission_classes = [permissions.IsAuthenticated]

class SubmissionViewSet(generics.RetrieveDestroyAPIView):
	queryset = Submission.objects.get_queryset()
	serializer_class = SubmissionSerializer
	permission_classes = [permissions.IsAuthenticated]

	def perform_destroy(self, instance):
		user = self.request.user

		if user.is_staff:
			operation = instance.delete()
			data = {}
			if operation:
				data["success"] = "delete successful"
			else:
				data["failure"] = "delete failed"
			return Response(data = data)
		return Response(status=status.HTTP_400_BAD_REQUEST)

class AnswerViewSet(generics.RetrieveDestroyAPIView):
	queryset = Answer.objects.get_queryset()
	serializer_class = AnswerSerializer
	permission_classes = [permissions.IsAuthenticated]

	def perform_destroy(self, instance):
		user = self.request.user
		try:
			student = user.student
		except Student.DoesNotExist:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		if instance in student.answer.all():
			operation = instance.delete()
			data = {}
			if operation:
				data["success"] = "delete successful"
			else:
				data["failure"] = "delete failed"
			return Response(data = data)
		return Response(status=status.HTTP_400_BAD_REQUEST)

class ResultViewSet(generics.RetrieveDestroyAPIView):
	queryset = Result.objects.get_queryset()
	serializer_class = ResultSerializer
	permission_classes = [permissions.IsAuthenticated]

	def perform_destroy(self, instance):
		user = self.request.user

		if user.is_staff:
			operation = instance.delete()
			data = {}
			if operation:
				data["success"] = "delete successful"
			else:
				data["failure"] = "delete failed"
			return Response(data = data)
		return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_teacher_registration_view(request):

	if request.method == 'POST':
		request.data['user']['user_type'] = 'TE'
		serializer = TeacherRegistrationSerializer(data = request.data)
		data = {}
		if serializer.is_valid():
			teacher = serializer.save()
			data['response'] = "Successfully registered a new teacher."
			data['email'] = teacher.user.email
			data['token'] = Token.objects.get(user=teacher.user).key
			return Response(data)
		else:
			data = serializer.errors
			return Response(data, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_student_registration_view(request):

	if request.method == 'POST':
		request.data['user']['user_type'] = 'ST'
		serializer = StudentRegistrationSerializer(data = request.data)
		data = {}
		if serializer.is_valid():
			student = serializer.save()
			data['response'] = "Successfully registered a new student."
			data['email'] = student.user.email
			data['token'] = Token.objects.get(user=student.user).key
			return Response(data)
		else:
			data = serializer.errors
			return Response(data, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_section_create_view(request):

	user = request.user
	try:
		teacher = user.teacher
	except Teacher.DoesNotExist:
		return Response(status=status.HTTP_400_BAD_REQUEST)

	if request.method == 'POST':
		request.data['teacher'] = teacher.pk
		serializer = SectionCreateSerializer(data = request.data)
		data = {}
		if serializer.is_valid():
			section = serializer.save()
			data['response'] = "Successfully created a new section."
			data['section_code'] = section.section_code
			data['section_data'] = section.semester_time
			data['pk'] = section.id
			return Response(data)
		else:
			data = serializer.errors
			return Response(data, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_quiz_create_view(request):

	user = request.user
	try:
		teacher = user.teacher
	except Teacher.DoesNotExist:
		return Response(status=status.HTTP_400_BAD_REQUEST)

	if request.method == 'POST':
		request.data['teacher'] = teacher.pk
		serializer = QuizCreateSerializer(data = request.data)
		data = {}
		if ( serializer.is_valid() ):
			quiz = serializer.save()
			data['response'] = "Successfully created a new quiz."
			data['id'] = quiz.id
		else:
			data = serializer.errors
		return Response(data)

class QuestionCreateViewSet(generics.CreateAPIView):
	permission_classes = [permissions.IsAuthenticated]
	serializer_class = QuestionCreateSerializer

	def create(self, request, *args, **kwargs):
		user = self.request.user
		try:
			teacher = user.teacher
		except Teacher.DoesNotExist:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		serializer = self.get_serializer(data = request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		headers = self.get_success_headers(serializer.data)
		return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class AssignmentCreateViewSet(generics.CreateAPIView):
	permission_classes = [permissions.IsAuthenticated]
	serializer_class = AssignmentCreateSerializer

	def create(self, request, *args, **kwargs):
		user = self.request.user
		try:
			teacher = user.teacher
		except Teacher.DoesNotExist:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		serializer = self.get_serializer(data = request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		headers = self.get_success_headers(serializer.data)
		return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class SubmissionCreateViewSet(generics.CreateAPIView):
	permission_classes = [permissions.IsAuthenticated]
	serializer_class = SubmissionCreateSerializer

	def create(self, request, *args, **kwargs):
		user = self.request.user
		try:
			student = user.student
		except Student.DoesNotExist:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		
		request.data["student"] = student.pk
		serializer = self.get_serializer(data = request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		print(serializer.data)
		headers = self.get_success_headers(serializer.data)
		return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class AnswerCreateViewSet(generics.CreateAPIView):
	permission_classes = [permissions.IsAuthenticated]
	serializer_class = AnswerCreateSerializer

	def create(self, request, *args, **kwargs):
		user = self.request.user
		try:
			student = user.student
		except Student.DoesNotExist:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		serializer = self.get_serializer(data = request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		headers = self.get_success_headers(serializer.data)
		return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ResultCreateViewSet(generics.CreateAPIView):
	permission_classes = [permissions.IsAuthenticated]
	serializer_class = ResultCreateSerializer

	def create(self, request, *args, **kwargs):
		user = self.request.user
		try:
			teacher = user.teacher
		except Teacher.DoesNotExist:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		serializer = self.get_serializer(data = request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		headers = self.get_success_headers(serializer.data)
		return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class CustomAuthToken(ObtainAuthToken):
	def post(self, request, *args, **kwargs):
		serializer = self.serializer_class(data=request.data,
		context={'request': request})
		serializer.is_valid(raise_exception=True)
		user = serializer.validated_data['user']
		token, created = Token.objects.get_or_create(user=user)

		try:
			user_pk = user.teacher.pk
		except Teacher.DoesNotExist:
			try:
				user_pk = user.student.pk
			except StudentDoesNotExist:
				user_pk = -1

		return Response({
			'token': token.key,
			'user_id': user_pk,
			'email': user.email,
			'user_type': user.user_type,
		})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_section_assignment_view(request):

	user = request.user
	try:
		teacher = user.teacher
	except Teacher.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	try:
		quiz = Quiz.objects.get(pk=request.data['quiz'])
	except Quiz.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if not quiz in teacher.quiz.all():
		return Response(status=status.HTTP_400_BAD_REQUEST)

	try:
		section = Section.objects.get(section_code=request.data['section'])
	except Section.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if request.method == 'POST':
		request.data.pop('section')
		data = []
		for student in section.students.all():
			datum = {}
			request.data['student'] = student.id
			serializer = AssignmentCreateSerializer(data=request.data)
			if (serializer.is_valid()):
				assignment = serializer.save()
				datum['student_pk'] = student.id
				datum['assignment_pk'] = assignment.id
			else:
				datum['error'] = serializer.errors
			data.append(datum)
		return Response(data, status=status.HTTP_200_OK)