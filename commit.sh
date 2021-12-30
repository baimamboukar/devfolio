
for file in *
do
        git add $file
        git commit -m "commiting $file"
        git push
done