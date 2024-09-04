from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Movies, Myrating, MyList, User
from .serializer import UserSerializer, MoviesSerializer, RatingSerializer
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
import requests
import pickle
import pandas as pd
from django.db.models import Case, When
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse



# WELC0OME user 
@api_view(['POST'])
def getRoutes(request):
    return Response({'message': 'welcome'})



# register  user 
@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'You have registered sucessfully Successfully '})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# user login 
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    
    if user:
        # Generate tokens using Simple JWT library
        refresh = RefreshToken.for_user(user)
        
        # Serialize tokens to strings before sending in the response
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token)})
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



# Logout user
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Simply returning a success message for demonstration
        # In practice, you might want to implement token blacklist or other mechanisms
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)




#list_all_users
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def list_all_users(request):
    try:
        users = User.objects.all()
        user_data = []
        for user in users:
            user_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            })
        
        return Response(user_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




#movies
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def spefic_movies(request,movie_id=None):
    # Print the username of the authenticated user
    print("Username:", request.user.username)

    movie = get_object_or_404(Movies, pk=movie_id)
    serializer = MoviesSerializer(movie)
    return Response(serializer.data)



#movies
@api_view(['GET'])
def movies(request):
    # Print the username of the authenticated user
    print("Username:", request.user.username)
    movies = Movies.objects.all()
    serializer = MoviesSerializer(movies, many=True)
    return Response(serializer.data)





#user_mylist
@api_view(['POST', 'DELETE', 'GET'])
@permission_classes([IsAuthenticated])
def manage_mylist(request):
    if request.method == 'POST':
        movie_title = request.data.get('movie')
        print(movie_title)
        
        username = request.user.username 
        print(username)
        
        # Ensure username is extracted correctly
        # Query the Movies model for the movie with the given title
        movie = Movies.objects.get(title=movie_title)
        movie_id = movie.id 
        user = request.user
        user_id = user.id 
        # Check if the movie already exists in the user's list
        mov = MyList.objects.filter(user=user_id , movie=movie_id).exists()
        if not mov:
            # Create and save the MyList object
            mylist_entry = MyList(user=user, movie=movie, watch=False)
            mylist_entry.save()
            return Response({'message': f'{movie_title} added to {username}\'s list.'}, status=201)
        else:
            return Response({'message': f'{movie_title} already exists in {username}\'s list.'}, status=400)
    
    elif request.method == 'DELETE':
        movie_title = request.data.get('movie')
        username = request.user.username  # Ensure username is extracted correctly
        
        # Query the Movies model for the movie with the given title
        movie = Movies.objects.get(title=movie_title)
        movie_id = movie.id 

        user = request.user
        user_id = user.id 

        mylist_item = MyList.objects.filter(user=user_id , movie=movie_id).first()
        if mylist_item:
            mylist_item.delete()
            return Response({'message': f'{movie_title} removed from {username}\'s list.'}, status=200)
        else:
            return Response({'message': f'{movie_title} is not in {username}\'s list.'}, status=400)
    
    elif request.method == 'GET':
        user = request.user
        user_id = user.id 
        print(user)
        print(user_id)
        mylist_entries = MyList.objects.filter(user=user)
        if mylist_entries:
            movies = [entry.movie for entry in mylist_entries]
            serializer = MoviesSerializer(movies, many=True)
            return Response(serializer.data)
        else:
            return Response([])


'''' 

#user_rating
@api_view(['POST', 'PUT', 'DELETE', 'GET'])
@permission_classes([IsAuthenticated])
def rating(request):

    if request.method == 'POST':
        logging.info(f"Request data: {request.data}")
        print(f"Request data: {request.data}")

        # Attempt to get the movie title and rating directly from request.data
        movie_title = request.data.get('movie')
        rating = request.data.get('rating')

        # If movie_title or rating is not found, fall back to extracting from request.POST.dict()
        if not movie_title or not rating:
            request_data2 = request.POST.dict()
            query_result2 = request_data2.get('queryResult', {})
            parameters2 = query_result2.get('parameters', {})
            
            # Extract movie title and rating from the nested structure
            movie_title = movie_title or parameters2.get('movie', [None])[0]
            rating = rating or parameters2.get('rating', [None])[0]

        # Print statements to debug
        print('movie_title:', movie_title)
        print('rating:', rating)

        # Query the Movies model for the movie with the given title
        try:
            movie = Movies.objects.get(title=movie_title)
        except Movies.DoesNotExist:
            return Response({'message': 'Movie not found.'}, status=404)

        user = request.user
        user_id = user.id
        print(user)
        print(user_id)

        # Check if the user has already rated the movie
        existing_rating = Myrating.objects.filter(user=user, movie=movie).first()
        if existing_rating:
            return Response({'message': 'You have already rated this movie.'}, status=400)
        
        # Create a new rating
        rating_saved = Myrating(user=user, movie=movie, rating=rating)
        rating_saved.save()
        return Response({'message': 'Rating added successfully.'}, status=201)
        
    elif request.method == 'PUT':
            username = request.user.username
            movie_title = request.data.get('movie')
            
            # Query the Movies model for the movie with the given title
            movie = Movies.objects.get(title=movie_title)
            movie_id = movie.id 
            print(movie)
            print(movie_id)
        
            user = User.objects.get(username=username)
            user_id = user.id
            print(user)
            print(user_id)  
            
            rating = request.data.get("rating")
            
            # Check if the user has already rated the movie
            existing_rating = Myrating.objects.filter(user=user, movie=movie).first()
            if not existing_rating:
                return Response({'message': 'User has not rated this movie yet.'}, status=400)
            
            # Check if the rating is the same as the existing rating
            if existing_rating.rating == rating:
                return Response({'message': 'you  have already rated the movie with the same rating.'}, status=400)
            
            # Update the existing rating
            serializer = RatingSerializer(existing_rating, data={'rating': rating}, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Rating updated successfully.'}, status=200)
            else:
                return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        
        username = request.user.username
        movie_title = request.data.get('movie')
        
        # Query the Movies model for the movie with the given title
        movie = Movies.objects.get(title=movie_title)
        movie_id = movie.id 
        print(movie)
        print(movie_id)
    
        user = User.objects.get(username=username)
        user_id = user.id
        print(user)
        print(user_id)
        
                
        # Check if the user has already rated the movie
        existing_rating = Myrating.objects.filter(user=user, movie=movie).first()
        if not existing_rating:
            return Response({'message': 'You have not rated this movie yet.'}, status=400)
        
        # Delete the existing rating
        existing_rating.delete()
        return Response({'message': 'Rating deleted successfully.'}, status=200) 

    
    elif request.method == 'GET':   
        username = request.user.username
        user = User.objects.get(username=username)
        user_id = user.id
        
        ratings = Myrating.objects.filter(user=user_id)
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data)    

'''

#user_rating
@api_view(['POST', 'PUT', 'DELETE', 'GET'])
@permission_classes([IsAuthenticated])
def rating(request):

    if request.method == 'POST':
        
        # Initialize movie_title and rating to None
        movie_title = None
        rating = None

        try:
            # Attempt to parse the JSON body and extract movie and rating from the nested structure
            data = json.loads(request.body)
            movie_title = data.get('queryResult', {}).get('parameters', {}).get('movie', [None])[0]
            rating = data.get('queryResult', {}).get('parameters', {}).get('rating', [None])[0]
            user = request.user
            user_id = user.id
            print(user)
            print(user_id)

        except (KeyError, json.JSONDecodeError):
            # If there's an error in parsing, just pass (will fallback to request.data)
            pass

        # If movie_title or rating is not found in the JSON body, attempt to get them from request.data
        if not movie_title:
            movie_title = request.data.get('movie')
        if not rating:
            rating = request.data.get('rating')
            user = request.user
            user_id = user.id
            print(user)
            print(user_id)

        # Print statements to debug
        print('movie_title:', movie_title)
        print('rating:', rating)

        # Query the Movies model for the movie with the given title
        try:
            movie = Movies.objects.get(title=movie_title)
        except Movies.DoesNotExist:
            return Response({'message': 'Movie not found.'}, status=404)

        # Check if the user has already rated the movie
        existing_rating = Myrating.objects.filter(user=user, movie=movie).first()
        if existing_rating:
            return Response({'message': 'You have already rated this movie.'}, status=400)
        
        # Create a new rating
        rating_saved = Myrating(user=user, movie=movie, rating=rating)
        rating_saved.save()
        return Response({'message': 'Rating added successfully.'}, status=201)
        
    elif request.method == 'PUT':

        # Initialize movie_title and rating to None
        movie_title = None
        rating = None

        try:
            # Attempt to parse the JSON body and extract movie and rating from the nested structure
            data = json.loads(request.body)
            movie_title = data.get('queryResult', {}).get('parameters', {}).get('movie', [None])[0]
            rating = data.get('queryResult', {}).get('parameters', {}).get('rating', [None])[0]
            user = request.user
            user_id = user.id
            print(user)
            print(user_id)

        except (KeyError, json.JSONDecodeError):
            # If there's an error in parsing, just pass (will fallback to request.data)
            pass

        # If movie_title or rating is not found in the JSON body, attempt to get them from request.data
        if not movie_title:
            movie_title = request.data.get('movie')
        if not rating:
            rating = request.data.get('rating')
            user = request.user
            user_id = user.id
            print(user)
            print(user_id)

        # Print statements to debug
        print('movie_title:', movie_title)
        print('rating:', rating)


        if not movie_title or not rating:
            return Response({'message': 'Movie title and rating are required.'}, status=400)

        try:
            movie = Movies.objects.get(title=movie_title)
        except Movies.DoesNotExist:
            return Response({'message': 'Movie not found.'}, status=404)


        # Check if the user has already rated the movie
        existing_rating = Myrating.objects.filter(user=user, movie=movie).first()
        if not existing_rating:
            return Response({'message': 'User has not rated this movie yet.'}, status=400)
        
        # Check if the rating is the same as the existing rating
        if existing_rating.rating == rating:
            return Response({'message': 'You have already rated the movie with the same rating.'}, status=400)
        
        # Update the existing rating
        serializer = RatingSerializer(existing_rating, data={'rating': rating}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Rating updated successfully.'}, status=200)
        else:
            return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        movie_title = request.data.get('movie')

        if not movie_title:
            return Response({'message': 'Movie title is required.'}, status=400)

        try:
            movie = Movies.objects.get(title=movie_title)
        except Movies.DoesNotExist:
            return Response({'message': 'Movie not found.'}, status=404)

        user = request.user
        user_id = user.id

        # Check if the user has already rated the movie
        existing_rating = Myrating.objects.filter(user=user, movie=movie).first()
        if not existing_rating:
            return Response({'message': 'You have not rated this movie yet.'}, status=400)
        
        # Delete the existing rating
        existing_rating.delete()
        return Response({'message': 'Rating deleted successfully.'}, status=200)

    elif request.method == 'GET':   
        user = request.user
        user_id = user.id
        
        ratings = Myrating.objects.filter(user=user_id)
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data)


#----charbot---------

# To get similar movies based on user rating
def get_similar(movie_name,rating,corrMatrix):
    similar_ratings = corrMatrix[movie_name]*(rating-2.5)
    similar_ratings = similar_ratings.sort_values(ascending=False)
    return similar_ratings 





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addupdatedeleterating(request):
    if request.method == 'POST':
        # Attempt to parse the JSON body and extract action, movie title, and rating
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return Response({'message': 'Invalid JSON'}, status=400)

        action = data.get('queryResult', {}).get('parameters', {}).get('action', [None])[0]
        movie_title = data.get('queryResult', {}).get('parameters', {}).get('movie', [None])[0]
        rating = data.get('queryResult', {}).get('parameters', {}).get('rating', [None])[0]

        # Get the current authenticated user
        user = request.user

        if action == 'update':
            
            # Ensure that movie_title and rating are provided
            if not movie_title or not rating:
                print('Movie title and rating are required.')
                return Response({'message': 'Movie title and rating are required.'}, status=400)

            try:
                movie = Movies.objects.get(title=movie_title)
            except Movies.DoesNotExist:
                print('Movie not found.')
                return Response({'message': 'Movie not found.'}, status=404)
            
            print(f"Rating: {rating}")
            print(f"Rating: {rating}")
            print(f"Rating: {rating}")


            # Check if the user has already rated the movie
            existing_rating = Myrating.objects.filter(user=user, movie=movie).first()
            if not existing_rating:
                print('User has not rated this movie yet.')
                return Response({'message': 'User has not rated this movie yet.'}, status=400)
            
            # Check if the rating is the same as the existing rating
            if existing_rating.rating == rating:
                print('You have already rated the movie with the same rating.')
                return Response({'message': 'You have already rated the movie with the same rating.'}, status=400)
            
            # Update the existing rating
            serializer = RatingSerializer(existing_rating, data={'rating': rating}, partial=True)
            if serializer.is_valid():
                serializer.save()
                print('Rating updated successfully.')
                return Response({'message': 'Rating updated successfully.'}, status=200)
            else:
                print(serializer.errors)  # Print the errors for debugging
                return Response(serializer.errors, status=400)
            
            
        elif action == 'addrating':
            
            # Ensure that movie_title and rating are provided
            if not movie_title or rating is None:
                return Response({'message': 'Movie title and rating are required.'}, status=400)

            # Query the Movies model for the movie with the given title
            try:
                movie = Movies.objects.get(title=movie_title)
            except Movies.DoesNotExist:
                return Response({'message': 'Movie not found.'}, status=404)

            # Check if the user has already rated the movie
            existing_rating = Myrating.objects.filter(user=user, movie=movie).first()
            if existing_rating:
                return Response({'message': 'You have already rated this movie.'}, status=400)

            # Create a new rating using the serializer
            rating_data = {'user': user.id, 'movie': movie.id, 'rating': rating}
            serializer = RatingSerializer(data=rating_data)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Rating added successfully.'}, status=201)
            else:
                return Response(serializer.errors, status=400)
        
        elif action == 'addtolist':
            ''' 
            username = request.user.username 
            print(username)
            
            # Ensure that movie_title and rating are provided
            if not movie_title is None:
                return Response({'message': 'Movie title and rating are required.'}, status=400)
            
                        # Query the Movies model for the movie with the given title
            try:
                movie = Movies.objects.get(title=movie_title)
            except Movies.DoesNotExist:
                return Response({'message': 'Movie not found.'}, status=404)
            
            
            
            # Ensure username is extracted correctly
            # Query the Movies model for the movie with the given title

            movie_id = movie.id 
            user = request.user
            user_id = user.id 
            
            
            existing_mylist =  MyList.objects.filter(user=user_id , movie=movie_id).exists()
            if existing_rating:
                return Response({'message': 'You have already rated this movie.'}, status=400)
            
            if not existing_mylist:
                # Create and save the MyList object
                mylist_entry = MyList(user=user, movie=movie, watch=False)
                mylist_entry.save()
                return Response({'message': f'{movie_title} added to {username}\'s list.'}, status=201)
            else:
                return Response({'message': f'{movie_title} already exists in {username}\'s list.'}, status=400)
                
            '''
            
            username = request.user.username 
            print(username)
            
            # Ensure username is extracted correctly
            # Query the Movies model for the movie with the given title
            movie = Movies.objects.get(title=movie_title)
            movie_id = movie.id 
            user = request.user
            user_id = user.id 
            # Check if the movie already exists in the user's list
            mov = MyList.objects.filter(user=user_id , movie=movie_id).exists()
            if not mov:
                # Create and save the MyList object
                mylist_entry = MyList(user=user, movie=movie, watch=False)
                mylist_entry.save()
                return Response({'message': f'{movie_title} added to {username}\'s list.'}, status=201)
            else:
                return Response({'message': f'{movie_title} already exists in {username}\'s list.'}, status=400)
            

        elif action == 'delete':
            # Ensure that movie_title is provided
            if not movie_title:
                return Response({'message': 'Movie title is required.'}, status=400)

            # Query the Movies model for the movie with the given title
            try:
                movie = Movies.objects.get(title=movie_title)
            except Movies.DoesNotExist:
                return Response({'message': 'Movie not found.'}, status=404)

            # Check if the user has rated the movie
            existing_rating = Myrating.objects.filter(user=user, movie=movie).first()
            if not existing_rating:
                return Response({'message': 'You have not rated this movie yet.'}, status=400)

            # Delete the existing rating
            existing_rating.delete()
            return Response({'message': 'Rating deleted successfully.'}, status=200)
        
        
        elif action =='deletemoviemylist':
                username = request.user.username  # Ensure username is extracted correctly
                
                # Query the Movies model for the movie with the given title
                movie = Movies.objects.get(title=movie_title)
                movie_id = movie.id 

                user = request.user
                user_id = user.id 

                mylist_item = MyList.objects.filter(user=user_id , movie=movie_id).first()
                if mylist_item:
                    mylist_item.delete()
                    return Response({'message': f'{movie_title} removed from {username}\'s list.'}, status=200)
                else:
                    return Response({'message': f'{movie_title} is not in {username}\'s list.'}, status=400)
                
        elif action == "recommend":
            movie_rating = pd.DataFrame(list(Myrating.objects.all().values()))
            new_user = Myrating.objects.values('user_id').distinct().count()
            current_user_id = request.user.id
            
            if current_user_id > new_user:
                default_movie = Movies.objects.get(id=20)
                # dummy_rating = Myrating(user=request.user, movie=default_movie, rating=0)
                # dummy_rating.save()

            userRatings = movie_rating.pivot_table(index='user_id', columns='movie_id', values='rating').fillna(0)
            corrMatrix = userRatings.corr(method='pearson')

            user_ratings_df = pd.DataFrame(list(Myrating.objects.filter(user=request.user).values('movie_id', 'rating')))
            movie_id_watched = user_ratings_df['movie_id'].tolist()

            similar_movies = pd.DataFrame()
            
            for _, row in user_ratings_df.iterrows():
                similar_movies = similar_movies.append(get_similar(row['movie_id'], row['rating'], corrMatrix), ignore_index=True)

            movies_id = similar_movies.sum().sort_values(ascending=False).index
            movies_id_recommend = [movie_id for movie_id in movies_id if movie_id not in movie_id_watched]
            preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(movies_id_recommend)])
            movie_list = Movies.objects.filter(id__in=movies_id_recommend).order_by(preserved)[:10]

            # Serialize the movie_list using MoviesSerializer
            serializer = MoviesSerializer(movie_list, many=True)
            serialized_data = serializer.data

            # Format response for Dialogflow
            movie_titles = [movie['title'] for movie in serialized_data]
            movie_list_text = ", ".join(movie_titles)

            dialogflow_response = {
                "fulfillmentText": f"I recommend the following movies: {movie_list_text}.",
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": [f"I recommend the following movies: {movie_list_text}."]
                        }
                    }
                ]
            }

            return JsonResponse(dialogflow_response)
            
        
        
        

    

















#-----chatbot----





# Recommendation Algorithm

@api_view(['POST', 'PUT', 'DELETE', 'GET'])
@permission_classes([IsAuthenticated])
def recommend(request):
    
    movie_rating = pd.DataFrame(list(Myrating.objects.all().values()))
    new_user = Myrating.objects.values('user_id').distinct().count()
    current_user_id = request.user.id
    
    if current_user_id > new_user:
        default_movie = Movies.objects.get(id=12)
        #dummy_rating = Myrating(user=request.user, movie=default_movie, rating=0)
        #dummy_rating.save()

    userRatings = movie_rating.pivot_table(index='user_id', columns='movie_id', values='rating').fillna(0)
    corrMatrix = userRatings.corr(method='pearson')

    user_ratings_df = pd.DataFrame(list(Myrating.objects.filter(user=request.user).values('movie_id', 'rating')))
    movie_id_watched = user_ratings_df['movie_id'].tolist()

    similar_movies = pd.DataFrame()
    
    for _, row in user_ratings_df.iterrows():
        similar_movies = similar_movies.append(get_similar(row['movie_id'], row['rating'], corrMatrix), ignore_index=True)

    movies_id = similar_movies.sum().sort_values(ascending=False).index
    movies_id_recommend = [movie_id for movie_id in movies_id if movie_id not in movie_id_watched]
    preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(movies_id_recommend)])
    movie_list = Movies.objects.filter(id__in=movies_id_recommend).order_by(preserved)[:10]

    # Serialize the movie_list using MoviesSerializer
    serializer = MoviesSerializer(movie_list, many=True)
    serialized_data = serializer.data

    context = {'movie_list': serialized_data}
    return Response(context)
 





















#------------------------------------------------------




#admin login 
@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Check if the user exists and is a superuser
    user = authenticate(username=username, password=password)
    if user and user.is_superuser:
        # If authentication successful and user is a superuser, generate tokens using Simple JWT library
        refresh = RefreshToken.for_user(user)
        # Serialize tokens to strings before sending in the response
        
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token)})
    else:
        return Response({'error': 'Invalid credentials or user is not a superuser'}, status=status.HTTP_401_UNAUTHORIZED)



#admin logout 
@api_view(['POST'])
def admin_logout(request):
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


#manage_users 
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_users(request):
    try:
        if request.method == 'GET':
            users = User.objects.all()
            user_data = []
            for user in users:
                user_data.append({
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser
                })
            
            return Response(user_data, status=status.HTTP_200_OK)
        
        elif request.method == 'DELETE':
            username = request.data.get('username')
            user = User.objects.get(username=username)
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        
        elif request.method == 'PUT':
            username = request.data.get('username')
            status_data = request.data.get('status')
            
            user = User.objects.get(username=username)
            
            if status_data == 'active':
                user.is_active = True
                user.is_staff = False
                user.is_superuser = False
            elif status_data == 'staff':
                user.is_active = True
                user.is_staff = True
                user.is_superuser = False
            elif status_data == 'superuser':
                user.is_active = True
                user.is_staff = True
                user.is_superuser = True
            else:
                return Response({'error': 'Invalid status provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.save()
            
            return Response({'message': 'User permissions updated successfully'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





#admin_manage_movie   
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def manage_movies(request):
    if request.method == 'GET':
        movies = Movies.objects.all()
        serializer = MoviesSerializer(movies, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        title = request.data.get('title')
        genre = request.data.get('genre')
        image_url = request.data.get('image_url')
        existing_movie = Movies.objects.filter(title=title, genre=genre, image_url=image_url).first()
        if existing_movie:
            return Response({'error': 'Movie already exists'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = MoviesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        
        movie_title = request.data.get('title')
        genre = request.data.get('genre')
        image_url = request.data.get('image_url')
        
        # Query the Movies model for the movie with the given title
        movie = get_object_or_404(Movies, title=movie_title)
        
        # Check if the provided data is the same as the stored data
        if (
            movie.title == movie_title and 
            movie.genre == genre and 
            movie.image_url == image_url
        ):
            return Response({'error': 'Movie with same info  already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = MoviesSerializer(movie, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    elif request.method == 'DELETE':
        movie_title = request.data.get('title')
        print(movie_title)
        #username = request.user.username
        #print(username)
        #movie = Movie.objects.filter(title=movie_title).first()
        movie = get_object_or_404(Movies, title=movie_title)
        if movie:
            movie.delete()
            return Response({'message': 'Movie has been deleted'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)



