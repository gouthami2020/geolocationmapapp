from django.shortcuts import render
from rest_framework.decorators import api_view
from django.shortcuts import HttpResponse
from rest_framework import status
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist
from app.models import Geolocation
import json
import datetime

def index(request):
    context = {}
    return render(request, "index.html", context=context)


def login_view(request):
    context = {}
    return render(request, "login.html", context=context)

def serialize_geolocation(geolocation):
    serialized = model_to_dict(geolocation)
    serialized["date"] = str(geolocation.date)
    serialized["name"] = str(geolocation.name)
    serialized["latitude"] = float(geolocation.latitude)
    serialized["longitude"] = float(geolocation.longitude)
    return serialized

def map_view(request):
    geolocation_data = Geolocation.objects.all()
    geolocation_data_final = [serialize_geolocation(geolocation) for geolocation in geolocation_data]
    context = {"data": json.dumps(geolocation_data_final)}
    return render(request, "map.html", context=context)
