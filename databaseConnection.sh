if [ $1 = "live" ]; then
    mysql -hdb-addn.jugnoo.in -u uttkarsh -pw7EyDV8tJbejTCY7;
elif [ $1 = "test" ]; then
    mysql -htest.jugnoo.in -u uttkarsh -pVNtKmGBVyqp6J3rS;
elif [ $1 = "test_neeraj" ]; then
    mysql -htest.jugnoo.in -u neeraj -pWuXKw7BWS978nVQq;
fi
