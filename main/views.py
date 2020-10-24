from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from main.models import Teacher, Student, Quiz, Question
from main.serializers import (
	SectionSerializer,
	TeacherSerializer,
	StudentSerializer,
	QuizSerializer,
	QuestionSerializer,
	TeacherRegistrationSerializer,
	StudentRegistrationSerializer
	)

@api_view(['GET', 'PUT', 'DELETE'])
def api_detail_section_view(request, pk):
	try:
		section = Section.object.get(pk = pk)
	except teacher.DoesNotExist:
		return Response(status = status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = SectionSerializer(section)
		return Response(serializer.data)
	elif request.method == 'PUT':
		serializer = SectionSerializer(section, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	elif request.method == 'DELETE':
		operation = section.delte()
		data = {}
		if operation:
			data["success"] = "delete successful"
		else:
			data["failure"] = "delete failed"
		return Response(data=data)

@api_view(['GET', 'PUT', 'DELETE'])
def api_detail_teacher_view(request, pk):
# Create your views here.
	try:
		teacher = Teacher.objects.get(pk = pk)
	except teacher.DoesNotExist:
		return Response(status = status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = TeacherSerializer(teacher)
		return Response(serializer.data)
	elif request.method == 'PUT':
		serializer = TeacherSerializer(teacher, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_40_BAD_REQUEST)
	elif request.method == 'DELETE':
		operation = teacher.delete()
		data = {}
		if operation:
			data["success"] = "delete successful"
		else:
			data["failure"] = "delete failed"
		return Response(data=data)

@api_view(['POST', ])
def api_teacher_registration_view(request):
	if request.method == 'POST':
		serializer = TeacherRegistrationSerializer(data=request.data)
		data = {}
		if serializer.is_valid():
			teacher = serializer.save()
			data['response'] = "Successfully registered a new user."
			data['email'] = teacher.user.email
		else:
			data = serializer.errors
		return Response(data)

@api_view(['GET', 'PUT', 'DELETE'])
def api_detail_student_view(request, pk):
# Create your views here.
	try:
		student = Student.objects.get(pk=pk)
	except student.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = StudentSerializer(student)
		return Response(serializer.data)
	elif request.method == 'PUT':
		serializer = StudentSerializer(student, data=reqeust.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_404_BAD_REQUEST)
	elif request.method == 'DELETE':
		operation = student.delete()
		data = {}
		if operation:
			data["success"] = "delete successful"
		else:
			data["failure"] = "delete failed"
		return Response(data=data)

@api_view(['POST', ])
def api_student_registration_view(request):
	if request.method == 'POST':
		serializer = StudentRegistrationSerializer(data=request.data)
		data = {}
		if serializer.is_valid():
			student = serializer.save()
			data['response'] = "Successfully registered a new user."
			data['email'] = student.email
		else:
			data = serializer.errors
		return Response(data)

@api_view(['GET', 'PUT', 'DELETE'])
def api_detail_quiz_view(request, pk):
# Create your views here.
	try:
		quiz = Quiz.objects.get(pk=pk)
	except quiz.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = QuizSerializer(quiz)
		return Response(serializer.data)
	elif request.method == 'PUT':
		serializer = QuizSerializer(quiz, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_404_BAD_REQUEST)
	elif request.method == 'DELETE':
		operation = quiz.delete()
		data = {}
		if operation:
			data["success"] = "delete successful"
		else:
			data["failure"] = "delete failed"
		return Response(data=data)

@api_view(['POST',])
def api_create_quiz_view(request):
	
	
	quiz = Quiz(teacher=teacher)

	if request.method == 'POST':
		serializer = QuizSerializer(quiz, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def api_detail_question_view(request, pk):
# Create your views here.
	try:
		question = Question.objects.get(pk=pk)
	except question.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = QuestionSerializer(question)
		return Response(serializer.data)
	elif request.method == 'PUT':
		serializer = QuestionSerializer(question, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_404_BAD_REQUEST)
	elif request.method == 'DELETE':
		operation = question.delete()
		data = {}
		if operation:
			data["success"] = "delete successful"
		else:
			data["failure"] = "delete failed"
		return Response(data=data)

@api_view(['POST',])
def api_create_question_view(request):
	
	quiz = Quiz.objects.get(pk=1)

	question = question(Quiz)

	if request.method == 'POST':
		serializer = QuestionSerializer(question, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATE)
		return Response(serializer.errors, status=status.HTT_400_BAD_REQUEST)