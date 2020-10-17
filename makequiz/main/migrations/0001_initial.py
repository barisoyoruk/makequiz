# Generated by Django 3.1.2 on 2020-10-17 12:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('student_ID', models.CharField(max_length=10, primary_key=True, serialize=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('teacher_ID', models.CharField(max_length=10, primary_key=True, serialize=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Quiz',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('students', models.ManyToManyField(to='main.Student')),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.teacher')),
            ],
        ),
    ]
