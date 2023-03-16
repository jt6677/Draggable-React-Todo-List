c:
	git add .
	git commit -m 'commit'

main:	
	git add .
	git commit -m 'commit'
	git push origin main	

d:
	pnpm run dev


build:
	pnpm run build


deploy task:
	supabase functions deploy stream_task_break --project-ref ietsbmkkzfutkjvzaypj