'use client'
import Input from "../ui/Input";




const ProfileForm = ({register, errors, setValue, defaultValue}: {register: any, errors: any, setValue: any, defaultValue: any}) => {



  return (
    <div className="text-primary flex-col flex gap-2">
      <div>
     
        <Input
                        label="Full Name"
                        type="text"
                        placeholder=""
                        defaultValue={defaultValue.fullName}
                        {...register("fullName")}
                        error={errors.fullName}
                      />
      </div>

      <div>
        <label className="text-sm text-tp-textMuted">Bio</label>
        <textarea
          {...register("bio")}
          defaultValue={defaultValue.bio}
          className="w-full mt-1 px-3 py-2 text-primary rounded-md border bg-tp-bgLight border-tp-border"
        />
        {errors.bio && (
            // @ts-ignore
                  <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>
                )}
      </div>
      <div>
        <label className="text-sm text-tp-textMuted">Avatar File</label>
        <input
                  type="file"
                  accept="image/*"
                  className="mt-1 w-full text-sm dark:text darkText border border-gray-200 px-2 py-1 rounded-lg"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setValue("avatar", e.target.files[0]);
                    }
                  }}
                />
                {errors.avatar && (
                    //@ts-ignore
                  <p className="text-xs text-red-500 mt-1">{errors.avatar.message}</p>
                )}
      </div>
        
    </div>
  )
}

export default ProfileForm
